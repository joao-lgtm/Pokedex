import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import { FaCaretDown, FaCaretLeft, FaCaretRight, FaCaretUp, FaMoon, FaPalette, FaSun } from "react-icons/fa";
import { useTheme } from "../../hooks/ThemeSwitcher";
import { loadVisitors } from "../../services/visitors";
import { useDevice, useScreenNavigate, type ControlKey } from "../../hooks/useDevice";
import { Customize } from "./Customize";
import { useCursor } from "./useCursor";
import { StickerLayer } from "./StickerLayer";
import { VolumeControl } from "./VolumeControl";
import {
    Bezel, BezelFooter, Body, Controls, DPad, Fin, Leds, Lens, Lid, Nav, NavButton, Page,
    Cursor, PillGroup, RotomEyes, RoundButton, Scanlines, Screen, ScreenFrame, Shell, ThemeToggle, TopBar, TopEdge,
} from "./style";

const BOOT_KEY = "@Pokedex:booted";
const BOOT_SOUND_KEY = "@Pokedex:boot-sound";
/** Sem interação o navegador bloqueia o áudio; depois disso o som de ligar já não faz sentido. */
const BOOT_SOUND_WINDOW = 10_000;

function shouldBoot() {
    try {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
        return !sessionStorage.getItem(BOOT_KEY);
    } catch {
        return false;
    }
}

export function Device({ children }: { children: ReactNode }) {
    const { theme, handleThemeSwitch } = useTheme();
    const { lensRef, screenRef, controlsRef, shellColor, mood, playBoot } = useDevice();
    const eyes = useRef<HTMLDivElement>(null);
    const navigate = useScreenNavigate();
    const { pathname } = useLocation();
    const [boot, setBoot] = useState(shouldBoot);
    const [visitors, setVisitors] = useState<number | null>(null);
    // customização da Pokédex; a da Rotom é aberta pelo próprio Quiz
    const [customizing, setCustomizing] = useState(false);
    const closeCustomize = useCallback(() => setCustomizing(false), []);

    // som de ligar, uma vez por sessão (independe do boot visual, que some com reduced-motion)
    useEffect(() => {
        try {
            if (sessionStorage.getItem(BOOT_SOUND_KEY)) return;
        } catch { /* sem storage: toca mesmo assim */ }
        const played = () => {
            try { sessionStorage.setItem(BOOT_SOUND_KEY, "1"); } catch { /* sem storage */ }
        };
        const unlocked = navigator.userActivation?.hasBeenActive ?? false;
        if (unlocked) {
            playBoot();
            played();
            return;
        }
        const startedAt = performance.now();
        const onFirstInteraction = () => {
            remove();
            if (performance.now() - startedAt > BOOT_SOUND_WINDOW) return;
            playBoot();
            played();
        };
        const remove = () => {
            window.removeEventListener("pointerdown", onFirstInteraction);
            window.removeEventListener("keydown", onFirstInteraction);
        };
        window.addEventListener("pointerdown", onFirstInteraction);
        window.addEventListener("keydown", onFirstInteraction);
        return remove;
    }, [playBoot]);

    useEffect(() => {
        loadVisitors().then(setVisitors).catch(() => { /* contador é opcional */ });
    }, []);

    useEffect(() => {
        if (!boot) return;
        try { sessionStorage.setItem(BOOT_KEY, "1"); } catch { /* sem storage */ }
        const timer = setTimeout(() => setBoot(false), 1800);
        return () => clearTimeout(timer);
    }, [boot]);

    const cursorRef = useRef<HTMLDivElement>(null);
    const lookAt = useCallback((rect: DOMRect) => {
        const el = eyes.current;
        if (!el) return;
        const box = el.getBoundingClientRect();
        const dx = (rect.left + rect.width / 2 - (box.left + box.width / 2)) / (window.innerWidth / 2);
        const dy = (rect.top + rect.height / 2 - (box.top + box.height / 2)) / (window.innerHeight / 2);
        el.style.setProperty("--eye-x", Math.max(-1, Math.min(1, dx)).toFixed(3));
        el.style.setProperty("--eye-y", Math.max(-1, Math.min(1, dy)).toFixed(3));
    }, []);
    // ←/→ entre Pokémon troca só o parâmetro: o cursor continua onde estava
    const cursorScope = pathname.startsWith("/pokemon/") ? "/pokemon" : pathname;
    const cursor = useCursor(screenRef, cursorRef, cursorScope, lookAt);

    function press(key: ControlKey) {
        navigator.vibrate?.(8);
        if (customizing && key === "b") return closeCustomize();
        const direction = key === "up" || key === "down" || key === "left" || key === "right" ? key : null;

        // D-pad move o cursor; sem item na direção, vale o comportamento da página
        if (direction && cursor.move(direction)) return;
        if (key === "a" && cursor.activate()) return;

        const handler = controlsRef.current[key];
        if (handler) return handler();

        const screen = screenRef.current;
        if (!screen) return;
        if (key === "up") screen.scrollBy({ top: -screen.clientHeight * 0.6, behavior: "smooth" });
        if (key === "down") screen.scrollBy({ top: screen.clientHeight * 0.6, behavior: "smooth" });
        if (key === "b" && pathname !== "/") navigate(-1);
        if (key === "start") navigate(pathname === "/game" ? "/" : "/game");
        if (key === "select") handleThemeSwitch();
    }

    const pressRef = useRef(press);
    pressRef.current = press;

    useEffect(() => {
        const keys: Record<string, ControlKey> = {
            ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right",
            Enter: "a", Escape: "b",
        };
        function onKey(event: KeyboardEvent) {
            const target = event.target as HTMLElement;
            const typing = target.closest("input, textarea, select");
            // dentro de um campo: setas/Enter são do campo; Esc sai dele e volta ao cursor
            if (typing) {
                if (event.key === "Escape") (typing as HTMLElement).blur();
                return;
            }
            const key = keys[event.key];
            if (!key || event.altKey || event.ctrlKey || event.metaKey) return;
            event.preventDefault();
            pressRef.current(key);
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    const isGame = pathname.startsWith("/game");

    // trocar de tela fecha o painel
    useEffect(() => setCustomizing(false), [pathname]);

    // olhos da Rotom acompanham o ponteiro/dedo; só variáveis CSS, sem re-render
    useEffect(() => {
        if (!isGame) return;
        let frame = 0;
        function onMove(event: PointerEvent) {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
                const el = eyes.current;
                if (!el) return;
                const rect = el.getBoundingClientRect();
                const dx = (event.clientX - (rect.left + rect.width / 2)) / (window.innerWidth / 2);
                const dy = (event.clientY - (rect.top + rect.height / 2)) / (window.innerHeight / 2);
                el.style.setProperty("--eye-x", Math.max(-1, Math.min(1, dx)).toFixed(3));
                el.style.setProperty("--eye-y", Math.max(-1, Math.min(1, dy)).toFixed(3));
            });
        }
        window.addEventListener("pointermove", onMove, { passive: true });
        window.addEventListener("pointerdown", onMove, { passive: true });
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerdown", onMove);
        };
    }, [isGame]);

    return (
        <Page>
            <Shell $rotom={isGame} $color={shellColor}>
                <Fin $side="left" $show={isGame} aria-hidden />
                <Fin $side="right" $show={isGame} aria-hidden />
                <TopBar>
                    <Lens ref={lensRef} $hidden={isGame} aria-hidden />
                    {isGame && (
                        <RotomEyes ref={eyes} $mood={mood} aria-hidden>
                            <span className="eye"><span className="iris" /></span>
                            <span className="dot" />
                            <span className="eye"><span className="iris" /></span>
                        </RotomEyes>
                    )}
                    <Leds $boot={boot} $hidden={isGame} aria-hidden>
                        <span /><span /><span />
                    </Leds>
                    <Nav>
                        <NavButton $active={!isGame} onClick={() => pathname !== "/" && navigate("/")}>
                            Pokédex
                        </NavButton>
                        <NavButton $active={isGame} onClick={() => !isGame && navigate("/game")}>
                            Quiz
                        </NavButton>
                        {!isGame && (
                            <ThemeToggle onClick={() => setCustomizing((open) => !open)} aria-label="Customizar Pokédex" aria-expanded={customizing}>
                                <FaPalette size={15} />
                            </ThemeToggle>
                        )}
                        <VolumeControl />
                        <ThemeToggle onClick={handleThemeSwitch} aria-label="Alternar tema">
                            {theme ? <FaSun size={16} /> : <FaMoon size={15} />}
                        </ThemeToggle>
                    </Nav>
                    <TopEdge viewBox="0 0 1000 34" preserveAspectRatio="none" aria-hidden style={{ opacity: isGame ? 0 : 1 }}>
                        <path d="M0 4 H340 L380 30 H1000" fill="none" stroke="rgba(0,0,0,.38)" strokeWidth="3" vectorEffect="non-scaling-stroke" />
                        <path d="M0 7 H338 L378 33 H1000" fill="none" stroke="rgba(255,255,255,.18)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                    </TopEdge>
                </TopBar>

                <Body>
                    <Bezel>
                        <ScreenFrame $boot={boot}>
                            <Screen ref={screenRef} id="screen">
                                {children}
                                <AnimatePresence>
                                    {customizing && !isGame && <Customize onClose={closeCustomize} />}
                                </AnimatePresence>
                            </Screen>
                            <Scanlines aria-hidden />
                            <Cursor ref={cursorRef} data-visible="false" aria-hidden />
                        </ScreenFrame>
                        <BezelFooter>
                            <span className="power" aria-hidden />
                            {visitors !== null && (
                                <span className="visitors" aria-label={`${visitors} visitantes`}>
                                    VISITAS {String(visitors).padStart(6, "0")}
                                </span>
                            )}
                            <span className="speaker" aria-hidden><span /><span /><span /><span /></span>
                        </BezelFooter>
                    </Bezel>
                </Body>

                <Controls data-dpad-control>
                    <RoundButton $color="#3a3a3a" aria-label="Voltar" onClick={() => press("b")} style={{ color: "#bbb" }}>
                        B
                    </RoundButton>
                    <PillGroup>
                        <button aria-label="Select: alternar tema" onClick={() => press("select")} />
                        <button aria-label="Start: alternar Pokédex e Quiz" onClick={() => press("start")} />
                    </PillGroup>
                    <RoundButton $color="#44d36b" aria-label="Confirmar" onClick={() => press("a")}>
                        A
                    </RoundButton>
                    <DPad>
                        <button className="up" aria-label="Cima" onClick={() => press("up")}><FaCaretUp /></button>
                        <button className="left" aria-label="Esquerda" onClick={() => press("left")}><FaCaretLeft /></button>
                        <button className="right" aria-label="Direita" onClick={() => press("right")}><FaCaretRight /></button>
                        <button className="down" aria-label="Baixo" onClick={() => press("down")}><FaCaretDown /></button>
                    </DPad>
                </Controls>

                <StickerLayer />
                <Lid $boot={boot} aria-hidden />
            </Shell>
        </Page>
    );
}
