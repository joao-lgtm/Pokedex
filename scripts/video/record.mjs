/**
 * Grava o vídeo de demonstração (1080x1350, 30 fps, sem áudio).
 * Uso: yarn video   (VIDEO_URL=meu-site.vercel.app yarn video)
 */
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import ffmpeg from "ffmpeg-static";
import { chromium } from "playwright";
import { buildScenes } from "./scenes.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "../..");
const out = join(here, "out");
const framesDir = join(out, "frames");
const PORT = 4173;
const APP = `http://localhost:${PORT}/`;
const SIZE = { width: 1080, height: 1350 };

function run(command, args, options = {}) {
    return new Promise((ok, fail) => {
        const child = spawn(command, args, { stdio: "inherit", ...options });
        child.on("error", fail);
        child.on("exit", (code) => (code === 0 ? ok() : fail(new Error(`${command} saiu com ${code}`))));
    });
}

// outro servidor na porta faria o vídeo gravar um build que não é o atual
function assertPortFree(port) {
    return new Promise((ok, fail) => {
        const probe = createServer()
            .once("error", () => fail(new Error(`a porta ${port} está ocupada: feche o outro servidor (ex.: yarn preview) e rode de novo.`)))
            .once("listening", () => probe.close(ok))
            .listen(port);
    });
}

async function waitForServer(url, timeout = 30000) {
    const end = Date.now() + timeout;
    while (Date.now() < end) {
        try {
            if ((await fetch(url)).ok) return;
        } catch { /* ainda subindo */ }
        await new Promise((r) => setTimeout(r, 300));
    }
    throw new Error(`preview não respondeu em ${url}`);
}

// Math.random previsível só dentro da aplicação: o quiz sorteia sempre o mesmo Pokémon
function seedRandom() {
    if (location.port !== "4173") return;
    let seed = 25;
    Math.random = () => {
        seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

async function main() {
    await assertPortFree(PORT);
    await rm(out, { recursive: true, force: true });
    await mkdir(framesDir, { recursive: true });

    const preview = spawn(process.execPath, [join(root, "node_modules/vite/bin/vite.js"), "preview", "--port", String(PORT), "--strictPort"], { cwd: root, stdio: ["ignore", "ignore", "inherit"] });
    const browser = await chromium.launch({ args: ["--autoplay-policy=no-user-gesture-required"] });
    try {
        await waitForServer(APP);
        const context = await browser.newContext({ viewport: SIZE, deviceScaleFactor: 1, reducedMotion: "no-preference", locale: "pt-BR" });
        // o vídeo não pode contar visitas nem gerar eventos de analytics
        await context.route(/abacus\.jasoncameron\.dev|\/_vercel\//, (route) => route.abort());
        await context.addInitScript(seedRandom);

        // aquece o cache (índice no localStorage) para a abertura não esperar a rede
        const warm = await context.newPage();
        await warm.goto(APP);
        await warm.getByRole("button", { name: /^Bulbasaur/ }).waitFor({ timeout: 30000 });
        await warm.close();

        const page = await context.newPage();
        await page.goto(pathToFileURL(join(here, "stage.html")).href);
        await page.evaluate(() => document.fonts.ready);
        const app = page.frameLocator("#app");

        const cdp = await context.newCDPSession(page);
        const frames = [];
        const writes = [];
        cdp.on("Page.screencastFrame", ({ data, metadata, sessionId }) => {
            const file = join(framesDir, `${String(frames.length).padStart(5, "0")}.jpg`);
            frames.push({ file, time: metadata.timestamp });
            writes.push(writeFile(file, Buffer.from(data, "base64")));
            cdp.send("Page.screencastFrameAck", { sessionId }).catch(() => {});
        });
        await cdp.send("Page.startScreencast", { format: "jpeg", quality: 90, maxWidth: SIZE.width, maxHeight: SIZE.height, everyNthFrame: 1 });

        const ctx = {
            page,
            app,
            wait: (ms) => page.waitForTimeout(ms),
            show: (data) => page.evaluate((d) => window.stage.show(d), data),
            card: (data) => page.evaluate((d) => window.stage.card(d), data),
            loadApp: async () => {
                await page.evaluate((src) => { document.getElementById("app").src = src; }, APP);
                await app.getByRole("button", { name: /^Bulbasaur/ }).waitFor({ timeout: 15000 });
            },
            // id da rodada vem da arte na TV; o nome (slug da espécie, o mesmo do jogo) vem da PokeAPI
            quizName: async () => {
                const img = app.locator('#screen img[alt^="Silhueta"]');
                await img.waitFor({ state: "attached", timeout: 15000 });
                const src = await img.getAttribute("src");
                const id = Number(src.match(/(\d+)\.png$/)[1]);
                const species = await (await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`, { signal: AbortSignal.timeout(15000) })).json();
                console.log(`quiz: #${id} ${species.name}`);
                return species.name;
            },
        };

        for (const scene of buildScenes({ url: process.env.VIDEO_URL || undefined })) {
            const started = Date.now();
            await scene.run(ctx);
            console.log(`cena ${scene.name}: ${((Date.now() - started) / 1000).toFixed(1)} s`);
        }

        // tela parada não gera quadros: o último dura até o fim da gravação (timestamp em s de época)
        const endTime = Date.now() / 1000;
        await cdp.send("Page.stopScreencast");
        await page.waitForTimeout(300);
        await Promise.all(writes);
        if (frames.length < 2) throw new Error("nenhum quadro capturado");

        // quadros chegam em ritmo irregular: cada um dura até o próximo
        const list = frames.map((frame, i) => {
            const next = frames[i + 1]?.time ?? Math.max(endTime, frame.time + 0.5);
            return `file '${frame.file.replace(/\\/g, "/")}'\nduration ${(next - frame.time).toFixed(4)}`;
        });
        list.push(`file '${frames.at(-1).file.replace(/\\/g, "/")}'`);
        const listFile = join(out, "frames.txt");
        await writeFile(listFile, list.join("\n"));

        const video = join(out, "pokedex-linkedin.mp4");
        await run(ffmpeg, ["-y", "-loglevel", "error", "-f", "concat", "-safe", "0", "-i", listFile,
            "-vf", `fps=30,scale=${SIZE.width}:${SIZE.height},format=yuv420p`,
            "-c:v", "libx264", "-crf", "18", "-preset", "slow", "-an", "-movflags", "+faststart", video]);
        const seconds = Math.max(endTime, frames.at(-1).time + 0.5) - frames[0].time;
        console.log(`vídeo: ${video} (${seconds.toFixed(1)} s, ${frames.length} quadros)`);
    } finally {
        await browser.close();
        preview.kill();
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
