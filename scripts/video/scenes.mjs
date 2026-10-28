/**
 * Roteiro do vídeo: cada cena atualiza a sobreposição (stage) e usa a aplicação
 * real dentro do iframe. Tempos em ms; total ~70 s.
 */

const CODE = {
    index: {
        file: "src/services/pokeapi.ts",
        code: `// 1 lista de espécies + 18 de tipos
const [species, ...typeLists] =
  await Promise.all([
    getJSON(\`pokemon-species?limit=1025\`),
    ...TYPES.map((type) =>
      getJSON(\`type/\${type}\`)),
  ]);
// índice salvo no localStorage`,
    },
    transition: {
        file: "src/hooks/useDevice.tsx",
        code: `// a arte "voa" do card ao detalhe
if (!document.startViewTransition) {
  return go();
}
document.startViewTransition(
  () => flushSync(go),
);
// <img style={{ viewTransitionName:
//   "pokemon-art" }} />`,
    },
    cry: {
        file: "src/hooks/useDevice.tsx",
        code: `const analyser =
  context.createAnalyser();
node.connect(analyser);
analyser.connect(output);
// a cada quadro: pico do áudio
analyser.getByteTimeDomainData(samples);
setLensLevel(peak); // lente pulsa`,
    },
    hints: {
        file: "src/pages/Game/hints.ts",
        code: `if (mode === "medium") return [
  types,
  \`Geração: \${gen}ª · \${genus}\`,
  \`Altura: \${height} m · \${weight} kg\`,
];
// difícil: Pokédex censurada,
// habitat, formato e cor`,
    },
};

// o iframe é escalado com CSS e o clique por coordenada erra o alvo: aciona pelo DOM
async function tap(locator) {
    const started = Date.now();
    await locator.waitFor({ timeout: 15000 });
    await locator.evaluate((el) => el.click());
    if (process.env.VIDEO_DEBUG) console.log(`  tap ${locator} ${Date.now() - started} ms`);
}

export function buildScenes({ url = "pokedex.vercel.app" } = {}) {
    return [
        {
            name: "abertura",
            async run({ show, loadApp, wait }) {
                show({
                    kicker: "Projeto pessoal",
                    title: "Pokédex · React + TypeScript",
                    caption: "Uma Pokédex de verdade no navegador: 1025 Pokémon, detalhes e um quiz.",
                    note: "A interface inteira é o aparelho: <b>lente, LEDs, D-pad e botões A/B funcionam.</b>",
                });
                await loadApp();
                await wait(4200);
            },
        },
        {
            name: "stacks",
            async run({ show, wait }) {
                show({
                    kicker: "Stack",
                    title: "O que tem por baixo",
                    badges: ["React 18", "TypeScript", "Vite", "styled-components", "Motion", "React Router", "PokeAPI", "Vercel"],
                    note: "Sem back-end e sem kit de UI pronto: <b>todo o visual é próprio</b>, com tema claro/escuro.",
                    caption: "Front-end moderno, tipado de ponta a ponta e publicado na Vercel.",
                });
                await wait(5500);
            },
        },
        {
            name: "home",
            async run({ show, app, wait }) {
                show({
                    kicker: "Home",
                    title: "Busca instantânea",
                    ...CODE.index,
                    caption: "O índice com os 1025 Pokémon sai de 19 requisições paralelas e fica em cache.",
                });
                const search = app.getByRole("searchbox", { name: "Buscar Pokémon" });
                await search.focus();
                await search.pressSequentially("char", { delay: 220 });
                await wait(1600);
                await search.fill("");
                await wait(500);
                await tap(app.getByRole("button", { name: "Água", exact: true }));
                await wait(1800);
                await tap(app.getByRole("button", { name: "Todos", exact: true }));
                await wait(1200);
            },
        },
        {
            name: "detalhe",
            async run({ show, app, wait }) {
                show({
                    kicker: "Detalhe",
                    title: "Transição entre páginas",
                    ...CODE.transition,
                    caption: "View Transitions API: a arte do card voa até o visor do detalhe.",
                });
                const search = app.getByRole("searchbox", { name: "Buscar Pokémon" });
                await search.focus();
                await search.pressSequentially("pikachu", { delay: 120 });
                await wait(700);
                await tap(app.getByRole("button", { name: /^Pikachu #0025/ }));
                await app.getByRole("button", { name: "Tocar o grito" }).waitFor({ timeout: 15000 });
                await wait(2600);
                await tap(app.getByRole("button", { name: "Shiny" }));
                await wait(2000);
                show({
                    kicker: "Detalhe",
                    title: "Tudo em pt-BR",
                    note: "Textos da Pokédex, categorias e habilidades traduzidos: <b>dataset estático de ~61 KB com gzip</b> carregado sob demanda.",
                    caption: "Descrição com efeito de máquina de escrever, stats animados e cadeia de evolução clicável.",
                });
                await app.locator("#screen").evaluate((el) => el.scrollBy({ top: 520, behavior: "smooth" }));
                await wait(2600);
                await app.locator("#screen").evaluate((el) => el.scrollBy({ top: 600, behavior: "smooth" }));
                await wait(2400);
                await app.locator("#screen").evaluate((el) => el.scrollTo({ top: 0, behavior: "smooth" }));
                await wait(1000);
            },
        },
        {
            name: "chassi",
            async run({ show, app, wait }) {
                show({
                    kicker: "Chassi",
                    title: "D-pad de verdade",
                    ...CODE.cry,
                    caption: "D-pad move um cursor espacial pela tela; o A toca o cry e a lente pulsa com o áudio (Web Audio).",
                });
                for (const key of ["Baixo", "Direita", "Esquerda"]) {
                    await tap(app.locator("[data-dpad-control]").getByRole("button", { name: key, exact: true }));
                    await wait(650);
                }
                await app.getByRole("button", { name: "Tocar o grito" }).focus();
                await tap(app.getByRole("button", { name: "Tocar o grito" }));
                await wait(2600);
                await tap(app.locator("[data-dpad-control]").getByRole("button", { name: "Voltar" }));
                await wait(1400);
            },
        },
        {
            name: "quiz",
            async run({ show, app, wait, quizName }) {
                show({
                    kicker: "Quiz da Rotom",
                    title: "Quem é esse Pokémon?",
                    ...CODE.hints,
                    caption: "Em /game o aparelho vira uma Rotom. Três modos: quanto mais difícil, mais vagas as dicas.",
                });
                await tap(app.getByRole("button", { name: "Quiz", exact: true }));
                await tap(app.getByRole("button", { name: /^Médio/ }));
                // a TV troca a arte depois de desligar: espera a rodada assentar
                await wait(1200);
                const name = await quizName();
                await tap(app.getByRole("button", { name: /Dica/ }));
                await wait(1500);
                await tap(app.getByRole("button", { name: /Dica/ }));
                await wait(1500);
                show({
                    kicker: "Quiz da Rotom",
                    title: "Forca + dicas + TV",
                    note: "Errar letras custa vidas; <b>ligar a TV para ver a silhueta</b> também custa (1 vida no Médio, 2 no Difícil).",
                    caption: "Placar com acertos, sequência e recorde. Cada rodada sorteia um dos 1025 Pokémon.",
                });
                await tap(app.getByRole("button", { name: "Ligar tela da Rotom" }));
                await tap(app.getByRole("button", { name: /^Ligar e usar/ }));
                await wait(1800);
                const letters = [...new Set(name.toUpperCase().replace(/[^A-Z]/g, ""))];
                const wrong = [..."QXZJKWVY"].find((letter) => !letters.includes(letter));
                await tap(app.locator("#screen").getByRole("button", { name: wrong, exact: true }));
                await wait(900);
                for (const letter of letters.slice(0, 2)) {
                    await tap(app.locator("#screen").getByRole("button", { name: letter, exact: true }));
                    await wait(700);
                }
                const answer = app.getByPlaceholder("Digite seu palpite…");
                await answer.focus();
                await answer.pressSequentially(name.replace(/-/g, " "), { delay: 110 });
                await tap(app.locator("#screen").getByRole("button", { name: "Confirmar" }));
                console.log(`quiz: ${await app.locator("#screen [role=status]").first().textContent()}`);
                await wait(2600);
            },
        },
        {
            name: "customizar",
            async run({ show, app, wait }) {
                show({
                    kicker: "Quiz da Rotom",
                    title: "Customize a sua Rotom",
                    note: "8 cores de carcaça e adesivos que você arrasta pelo aparelho. <b>O perfil fica salvo por uma interface de repositório</b>, pronta para trocar por uma API.",
                    caption: "A cor muda o chassi inteiro com transição suave; toque duplo remove o adesivo.",
                });
                await tap(app.getByRole("button", { name: /Customizar/ }).first());
                const colors = app.locator(".custom-colors button");
                await tap(colors.nth(2));
                await wait(1100);
                await tap(colors.nth(5));
                await wait(1100);
                await tap(app.locator(".sticker-catalog button").first());
                await wait(900);
                await tap(app.locator(".sticker-catalog button").nth(2));
                await wait(1100);
                await tap(app.getByRole("button", { name: "Fechar customização" }));
                await wait(1400);
            },
        },
        {
            name: "dificuldades",
            async run({ show, app, wait }) {
                show({
                    kicker: "Bastidores",
                    title: "Dificuldades do projeto",
                    note: "<b>Desempenho:</b> 1025 cards com grade incremental e lazy-load das rotas.<br><br><b>Tradução:</b> 1025 espécies + 374 habilidades para pt-BR.<br><br><b>Navegação:</b> cursor do D-pad em qualquer tela, sem mouse.",
                    caption: "Mobile-first: o mesmo aparelho funciona do celular de 360 px ao desktop.",
                });
                await tap(app.getByRole("button", { name: "Pokédex", exact: true }));
                await app.getByRole("searchbox", { name: "Buscar Pokémon" }).fill("");
                await wait(1500);
                await app.locator("#screen").evaluate((el) => el.scrollBy({ top: 1400, behavior: "smooth" }));
                await wait(3000);
                await app.locator("#screen").evaluate((el) => el.scrollTo({ top: 0, behavior: "smooth" }));
                await wait(2000);
            },
        },
        {
            name: "fechamento",
            async run({ card, wait }) {
                card({
                    heading: "Pokédex",
                    lines: [
                        `Teste no navegador: <strong>${url}</strong>`,
                        "Código: <strong>github.com/joao-lgtm/Pokedex</strong>",
                    ],
                });
                await wait(4500);
            },
        },
    ];
}
