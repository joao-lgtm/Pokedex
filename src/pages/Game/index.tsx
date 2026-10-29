import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { RotomScreen } from "../../components/Rotom";
import { ROTOM_COLORS } from "../../components/Rotom/colors";
import { useControls, useDevice } from "../../hooks/useDevice";
import { artworkUrl, formatName, loadPokemonDetail, loadPokemonIndex, MAX_POKEMON, preloadImage, type PokemonDetail, type PokemonIndexEntry } from "../../services/pokeapi";
import { Customize } from "../../components/Device/Customize";
import { buildHints, MODES, type Mode } from "./hints";
import { Container } from "./style";

type Score = { wins: number; streak: number; best: number };
type Round = { id: number; letters: string[]; errors: number; status: "playing" | "won" | "lost"; hint: number; power: boolean };
const SCORE_KEY = "@Pokedex:quiz:score";
const MODE_KEY = "@Pokedex:quiz:mode";
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const randomId = () => 1 + Math.floor(Math.random() * MAX_POKEMON);
const makeRound = (id: number, mode: Mode | null): Round => ({ id, letters: [], errors: 0, status: "playing", hint: 0, power: mode === "easy" });
const normalize = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().replace(/[^A-Z0-9]/g, "");
function readScore(): Score {
    try {
        const score = JSON.parse(localStorage.getItem(SCORE_KEY) ?? "null");
        if (score && [score.wins, score.streak, score.best].every((n) => Number.isSafeInteger(n) && n >= 0)) return score;
    } catch { /* armazenamento indisponível */ }
    return { wins: 0, streak: 0, best: 0 };
}
function readMode(): Mode | null {
    try { const saved = sessionStorage.getItem(MODE_KEY); if (MODES.some((mode) => mode.id === saved)) return saved as Mode; } catch { /* sem storage */ }
    return null;
}
export function Game() {
    const { blink, playCry, setMood, setStickerEdit } = useDevice();
    const [mode, setMode] = useState(readMode);
    const [choosing, setChoosing] = useState(!mode);
    const [customizing, setCustomizing] = useState(false);
    const closeCustomize = useCallback(() => setCustomizing(false), []);
    const [index, setIndex] = useState<PokemonIndexEntry[] | null>(null);
    const [error, setError] = useState(false);
    const [round, setRound] = useState(() => makeRound(randomId(), mode));
    const roundRef = useRef(round);
    const nextId = useRef(randomId());
    const [detail, setDetail] = useState<PokemonDetail | null>(null);
    const [detailError, setDetailError] = useState(false);
    const [detailAttempt, setDetailAttempt] = useState(0);
    const [score, setScore] = useState(readScore);
    const [answer, setAnswer] = useState("");
    const [powerWarning, setPowerWarning] = useState(false);
    const pokemon = index?.find((p) => p.id === round.id);
    const config = MODES.find((item) => item.id === mode);
    const hints = detail?.id === round.id && mode ? buildHints(mode, detail) : [];
    const hintCount = mode === "hard" ? 4 : 3;
    const load = useCallback(() => {
        setError(false); blink("busy");
        let active = true;
        loadPokemonIndex().then((entries) => { if (active) setIndex(entries); }).catch(() => { if (active) { setError(true); blink("error"); } });
        return () => { active = false; };
    }, [blink]);
    useEffect(load, [load]);
    useEffect(() => () => { setMood("idle"); setStickerEdit(false); }, [setMood, setStickerEdit]);
    useEffect(() => {
        if (!mode) return;
        let active = true;
        setDetailError(false);
        loadPokemonDetail(round.id).then((data) => { if (active) setDetail(data); }).catch(() => { if (active) setDetailError(true); });
        preloadImage(artworkUrl(nextId.current));
        void loadPokemonDetail(nextId.current).catch(() => { /* a próxima rodada oferece nova tentativa */ });
        return () => { active = false; };
    }, [round.id, mode, detailAttempt]);
    useEffect(() => { try { localStorage.setItem(SCORE_KEY, JSON.stringify(score)); } catch { /* sem storage */ } }, [score]);

    const commitRound = useCallback((next: Round) => {
        const previous = roundRef.current;
        roundRef.current = next; setRound(next);
        if (previous.status === "playing" && next.status !== "playing") {
            const won = next.status === "won";
            setMood(won ? "happy" : "wrong"); blink(won ? "success" : "error");
            setScore((old) => { const streak = won ? old.streak + 1 : 0; return { wins: old.wins + Number(won), streak, best: Math.max(old.best, streak) }; });
            setPowerWarning(false);
        }
    }, [blink, setMood]);
    const guess = useCallback((value: string) => {
        const current = roundRef.current;
        const target = index?.find((p) => p.id === current.id);
        const guessText = normalize(value);
        if (choosing || customizing || powerWarning || !mode || !target || current.status !== "playing" || !guessText) return;
        const name = normalize(target.name);
        const single = guessText.length === 1;
        if (single && current.letters.includes(guessText)) return;
        const letters = single ? [...current.letters, guessText] : current.letters;
        const correct = single ? name.includes(guessText) : name === guessText;
        const errors = Math.min(6, current.errors + (correct ? 0 : 1));
        const won = correct && (!single || [...name].every((letter) => !/[A-Z]/.test(letter) || letters.includes(letter)));
        const status = won ? "won" : errors >= 6 ? "lost" : "playing";
        commitRound({ ...current, letters, errors, status, power: status !== "playing" || current.power });
        setMood(correct ? "happy" : "wrong"); setAnswer("");
    }, [index, choosing, customizing, powerWarning, mode, commitRound, setMood]);
    const startRound = (selected: Mode) => {
        setMode(selected); setChoosing(false); setPowerWarning(false); setAnswer(""); setMood("idle");
        try { sessionStorage.setItem(MODE_KEY, selected); } catch { /* sem storage */ }
        const fresh = makeRound(randomId(), selected); roundRef.current = fresh; setRound(fresh);
    };
    const next = useCallback(() => {
        if (roundRef.current.status === "playing" || !mode) return;
        const upcoming = nextId.current;
        do { nextId.current = randomId(); } while (nextId.current === upcoming);
        const fresh = makeRound(upcoming, mode);
        roundRef.current = fresh; setRound(fresh); setAnswer(""); setPowerWarning(false); setMood("idle");
    }, [mode, setMood]);
    const togglePower = () => {
        const current = roundRef.current;
        if (current.power) { commitRound({ ...current, power: false }); setPowerWarning(false); return; }
        if (current.status !== "playing" || !config?.cost) { commitRound({ ...current, power: true }); return; }
        setPowerWarning(true);
    };
    const buyPower = () => {
        const current = roundRef.current;
        if (!powerWarning || current.power || current.status !== "playing" || !config) return;
        const errors = Math.min(6, current.errors + config.cost);
        commitRound({ ...current, errors, power: true, status: errors >= 6 ? "lost" : "playing" });
        setPowerWarning(false);
    };
    const hint = () => {
        if (choosing || customizing || !pokemon || !hints.length || roundRef.current.status !== "playing") return;
        commitRound({ ...roundRef.current, hint: Math.min(hintCount, roundRef.current.hint + 1) });
    };
    const confirm = () => { if (customizing || choosing) return; if (round.status !== "playing") next(); else if (!powerWarning && answer.trim()) guess(answer); };
    useControls({ a: confirm, b: () => { if (customizing) closeCustomize(); else if (powerWarning) setPowerWarning(false); else setChoosing(true); }, select: () => { if (pokemon && !choosing && !customizing) void playCry(pokemon.id); } });
    useEffect(() => {
        function keydown(event: KeyboardEvent) {
            if ((event.target as HTMLElement).closest("input, textarea, select, [contenteditable=true]") || event.ctrlKey || event.metaKey || event.altKey || event.repeat || customizing || choosing || powerWarning) return;
            if (/^[a-z]$/i.test(event.key)) { event.preventDefault(); guess(event.key); }
        }
        window.addEventListener("keydown", keydown);
        return () => window.removeEventListener("keydown", keydown);
    }, [guess, customizing, choosing, powerWarning]);
    const finished = round.status !== "playing";
    return <MotionConfig reducedMotion="user"><Container>
        <header><h1>Quem é esse Pokémon?</h1></header>
        {choosing ? <section className="mode-picker" aria-label="Escolha a dificuldade"><p>Como você quer jogar?</p><div className="mode-cards">{MODES.map((item, i) => <motion.button key={item.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .07 }} onClick={() => startRound(item.id)}><strong>{item.label}</strong><span>{item.description}</span></motion.button>)}</div><button onClick={() => setCustomizing(true)}>Customizar Rotom</button></section> : error ? <div role="alert"><p>Sem sinal com o Professor Carvalho.</p><button onClick={load}>Tentar novamente</button></div> : !pokemon ? <p role="status">Sintonizando a Rotom Dex…</p> : <>
            <div className="tv-column">
                <RotomScreen sprite={artworkUrl(round.id)} revealed={finished} power={round.power} onPower={togglePower} />
                <div className="tv-tools"><button onClick={() => setCustomizing(true)}>✦ Customizar</button><div className="lives" role="img" aria-label={`${6 - round.errors} de 6 vidas`}>{Array.from({ length: 6 }, (_, i) => <i key={`${round.id}-${i}`} className={i < 6 - round.errors ? "ball" : "ball lost"} />)}</div></div>
                {powerWarning && <div className="power-warning" role="alert"><p>Ligar a tela custa {config?.cost} {config?.cost === 1 ? "vida" : "vidas"}.{6 - round.errors <= (config?.cost ?? 0) && " Isso encerra a rodada."}</p><button onClick={buyPower}>Ligar e usar {config?.cost} {config?.cost === 1 ? "vida" : "vidas"}</button><button onClick={() => setPowerWarning(false)}>Cancelar</button></div>}
                <div className="mode-tools"><span>{config?.label} · {hintCount} dicas</span><button onClick={() => setChoosing(true)}>Trocar modo</button></div>
                <section className="hint-log" aria-label="Registro de dicas"><h2>▸ Registro</h2><div className="log-lines" role="log" aria-live="polite">{round.hint ? hints.slice(0, round.hint).map((text, i) => <motion.p key={`${round.id}-${i}`} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}><b>{String(i + 1).padStart(2, "0")}</b> {text}</motion.p>) : <p className="log-empty">Peça uma dica para iniciar a investigação.</p>}</div>{detailError && <button onClick={() => setDetailAttempt((n) => n + 1)}>Reconectar dicas</button>}</section>
            </div>
            <div className="play-column">
                <div className="score" aria-label="Placar"><span><span className="score-label">Acertos</span><abbr title="Acertos">A</abbr> <b>{score.wins}</b></span><span><span className="score-label">Sequência</span><abbr title="Sequência">S</abbr> <b>{score.streak}</b></span><span><span className="score-label">Recorde</span><abbr title="Recorde">R</abbr> <b>{score.best}</b></span></div>
                <div className="result" role="status" aria-live="polite">{round.status === "won" ? `É o ${formatName(pokemon.name)}!` : round.status === "lost" ? `Era o ${formatName(pokemon.name)}! Vamos tentar outro?` : `${6 - round.errors} vidas · Escolha uma letra ou chute o nome.`}</div>
                {round.status === "won" && <div className="confetti" aria-hidden>{Array.from({ length: 18 }, (_, i) => <i key={i} style={{ left: `${5 + i * 5}%`, background: ROTOM_COLORS[i % ROTOM_COLORS.length].value, animationDelay: `${i % 6 * .09}s` }} />)}</div>}
                <div className="slots" aria-label="Letras do nome">{[...pokemon.name.toUpperCase()].map((letter, i) => {
                    const visible = finished || !/[A-Z]/.test(letter) || round.letters.includes(letter);
                    return <span key={`${round.id}-${i}`} className={`slot ${visible ? "open" : ""}`}><span>{visible ? letter : "_"}</span></span>;
                })}</div>
                <div className="actions"><button disabled={finished || round.hint >= hintCount || !hints.length} onClick={hint}>✦ Dica {round.hint}/{hintCount}</button><button onClick={() => void playCry(round.id)}>♫ Ouvir cry</button>{finished && <button className="primary" onClick={next}>Próximo →</button>}</div>
                <div className="keyboard" role="group" aria-label="Teclado de letras">{alphabet.map((letter) => {
                    const used = round.letters.includes(letter);
                    const state = used ? normalize(pokemon.name).includes(letter) ? "correct" : "wrong" : "";
                    return <button key={letter} disabled={finished || used || powerWarning} className={state} onClick={() => guess(letter)} aria-label={`${letter}${used ? state === "correct" ? ", correta" : ", incorreta" : ""}`}>{letter}</button>;
                })}</div>
                <form onSubmit={(event) => { event.preventDefault(); guess(answer); }}><label htmlFor="pokemon-answer">Já sabe o nome?</label><div className="answer"><input id="pokemon-answer" autoComplete="off" spellCheck={false} maxLength={40} disabled={finished || powerWarning} placeholder="Digite seu palpite…" value={answer} onChange={(event) => setAnswer(event.target.value)} /><button className="primary" disabled={finished || powerWarning || !normalize(answer)}>Confirmar</button></div></form>
                <small>D-pad: mover • A: selecionar • B: voltar</small>
            </div>
        </>}
        <AnimatePresence>{customizing && <Customize onClose={closeCustomize} />}</AnimatePresence>
    </Container></MotionConfig>;
}
