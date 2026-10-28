import { useCallback, useEffect, useRef } from "react";
import { firstVisible, isNavigable, nearest, scopeOf, type Direction } from "./spatial";

/**
 * Cursor do D-pad: destaca o item selecionado com um anel que desliza entre os
 * elementos (transform), segue a rolagem e some quando o usuário volta ao mouse/toque.
 */
export function useCursor(
    screenRef: React.RefObject<HTMLDivElement>,
    cursorRef: React.RefObject<HTMLDivElement>,
    resetKey: string,
    onMove?: (rect: DOMRect) => void,
) {
    const selected = useRef<HTMLElement | null>(null);
    const follow = useRef(0);

    const place = useCallback(() => {
        const cursor = cursorRef.current;
        const el = selected.current;
        const frame = cursor?.parentElement;
        if (!cursor || !frame) return;
        if (!el || !el.isConnected) {
            cursor.dataset.visible = "false";
            return;
        }
        const box = frame.getBoundingClientRect();
        const rect = el.getBoundingClientRect();
        const pad = 4;
        cursor.style.transform = `translate(${rect.left - box.left - pad}px, ${rect.top - box.top - pad}px)`;
        cursor.style.width = `${rect.width + pad * 2}px`;
        cursor.style.height = `${rect.height + pad * 2}px`;
        const radius = getComputedStyle(el).borderTopLeftRadius;
        cursor.style.borderRadius = radius.endsWith("%") ? radius : `${Math.min(parseFloat(radius) || 10, rect.height / 2) + pad}px`;
        cursor.dataset.visible = "true";
        onMove?.(rect);
    }, [cursorRef, onMove]);

    // acompanha a rolagem suave por alguns quadros
    const track = useCallback(() => {
        cancelAnimationFrame(follow.current);
        const end = performance.now() + 450;
        const tick = () => {
            place();
            if (performance.now() < end) follow.current = requestAnimationFrame(tick);
        };
        tick();
    }, [place]);

    // como scrollIntoView, mas respeitando cabeçalhos fixos (data-sticky) no topo da tela
    const reveal = useCallback((el: HTMLElement) => {
        const screen = screenRef.current;
        if (!screen) return;
        el.closest<HTMLElement>("[data-dpad-row]")?.scrollTo?.({
            left: el.offsetLeft - (el.parentElement?.clientWidth ?? 0) / 2 + el.clientWidth / 2,
            behavior: "smooth",
        });
        const box = screen.getBoundingClientRect();
        const rect = el.getBoundingClientRect();
        const sticky = [...screen.querySelectorAll<HTMLElement>("[data-sticky]")]
            .filter((node) => !node.contains(el))
            .reduce((max, node) => Math.max(max, node.getBoundingClientRect().bottom - box.top), 0);
        const top = box.top + sticky + 8;
        const bottom = box.bottom - 8;
        if (rect.top < top) screen.scrollBy({ top: rect.top - top, behavior: "smooth" });
        else if (rect.bottom > bottom) screen.scrollBy({ top: Math.min(rect.bottom - bottom, rect.top - top), behavior: "smooth" });
    }, [screenRef]);

    const select = useCallback((el: HTMLElement | null) => {
        selected.current = el;
        if (!el) return place();
        // campos de texto só ganham foco com A; senão as setas ficariam presas neles
        const isField = el.matches("input, textarea, select");
        if (isField) (document.activeElement as HTMLElement | null)?.blur?.();
        else el.focus({ preventScroll: true });
        reveal(el);
        track();
    }, [place, track]);

    /** Move o cursor; retorna false quando não há item naquela direção. */
    const move = useCallback((direction: Direction) => {
        const screen = screenRef.current;
        if (!screen) return false;
        const root = scopeOf(screen);
        let current = selected.current;
        // depois de mouse/toque, parte do último item tocado
        const active = document.activeElement as HTMLElement | null;
        if (cursorRef.current?.dataset.visible !== "true" && active && root.contains(active) && isNavigable(active)) {
            select(active);
            return true;
        }
        if (current && (!current.isConnected || !root.contains(current) || !isNavigable(current))) current = null;
        if (!current || cursorRef.current?.dataset.visible !== "true") {
            const first = firstVisible(root);
            if (!first) return false;
            select(first);
            return true;
        }
        const next = nearest(root, current, direction);
        if (!next) {
            cursorRef.current?.animate(
                [{ translate: "0 0" }, { translate: direction === "left" ? "-4px 0" : direction === "right" ? "4px 0" : direction === "up" ? "0 -4px" : "0 4px" }, { translate: "0 0" }],
                { duration: 180, easing: "ease-out" },
            );
            return false;
        }
        select(next);
        return true;
    }, [screenRef, cursorRef, select]);

    /** Aciona o item selecionado; retorna false se não houver seleção ativa. */
    const activate = useCallback(() => {
        const el = selected.current;
        if (!el || !el.isConnected || cursorRef.current?.dataset.visible !== "true") return false;
        cursorRef.current.animate([{ scale: "1" }, { scale: ".94" }, { scale: "1" }], { duration: 160 });
        if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) el.focus();
        else el.click();
        requestAnimationFrame(track);
        return true;
    }, [cursorRef, track]);

    const hide = useCallback(() => {
        if (cursorRef.current) cursorRef.current.dataset.visible = "false";
    }, [cursorRef]);

    useEffect(() => {
        const screen = screenRef.current;
        if (!screen) return;
        const onScroll = () => cursorRef.current?.dataset.visible === "true" && place();
        screen.addEventListener("scroll", onScroll, { passive: true, capture: true });
        // conteúdo mudou de tamanho (cards carregando, dica nova): reposiciona o anel
        const resize = new ResizeObserver(onScroll);
        for (const child of screen.children) resize.observe(child);
        const mutations = new MutationObserver(() => {
            if (cursorRef.current?.dataset.visible !== "true") return;
            const el = selected.current;
            if (el && (!el.isConnected || !scopeOf(screen).contains(el))) hide();
            else requestAnimationFrame(place);
        });
        mutations.observe(screen, { childList: true, subtree: true, attributes: true, attributeFilter: ["disabled", "class", "aria-hidden"] });
        window.addEventListener("resize", onScroll);
        // mouse/toque escondem o cursor (o D-pad físico na carcaça não conta)
        const onPointer = (event: PointerEvent) => {
            if (!(event.target as HTMLElement).closest("[data-dpad-control]")) hide();
        };
        window.addEventListener("pointerdown", onPointer, { passive: true });
        return () => {
            screen.removeEventListener("scroll", onScroll, { capture: true });
            resize.disconnect();
            mutations.disconnect();
            window.removeEventListener("resize", onScroll);
            window.removeEventListener("pointerdown", onPointer);
        };
    }, [screenRef, cursorRef, place, hide]);

    // trocou de tela: começa sem seleção
    useEffect(() => {
        selected.current = null;
        hide();
    }, [resetKey, hide]);

    useEffect(() => () => cancelAnimationFrame(follow.current), []);

    return { move, activate, hide };
}
