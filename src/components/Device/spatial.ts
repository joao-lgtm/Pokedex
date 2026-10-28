export type Direction = "up" | "down" | "left" | "right";

const FOCUSABLE = [
    "button:not([disabled])",
    "a[href]",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "[data-dpad]",
].join(",");

/** Painel modal aberto (sheet, confirmação) restringe o cursor ao seu conteúdo. */
export function scopeOf(screen: HTMLElement): HTMLElement {
    const scopes = screen.querySelectorAll<HTMLElement>("[data-dpad-scope], [role='dialog'], [aria-modal='true']");
    return scopes[scopes.length - 1] ?? screen;
}

export function isNavigable(el: HTMLElement) {
    return el.matches(FOCUSABLE) && !el.closest("[aria-hidden='true'], [inert], [data-dpad-skip]");
}

function isVisible(el: HTMLElement, frame: DOMRect) {
    if (el.closest("[aria-hidden='true'], [inert], [data-dpad-skip]")) return false;
    const rect = el.getBoundingClientRect();
    if (rect.width < 4 || rect.height < 4) return false;
    // aceita itens um pouco fora da área visível: o cursor rola até eles
    if (!el.closest("[data-dpad-row]") && (rect.right < frame.left - 2 || rect.left > frame.right + 2)) return false;
    return rect.bottom > frame.top - frame.height && rect.top < frame.bottom + frame.height;
}

export function focusables(root: HTMLElement) {
    const frame = root.getBoundingClientRect();
    return [...root.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => isVisible(el, frame));
}

/** Primeiro item visível, de cima para baixo e da esquerda para a direita. */
export function firstVisible(root: HTMLElement) {
    const frame = root.getBoundingClientRect();
    return focusables(root)
        .filter((el) => {
            const rect = el.getBoundingClientRect();
            return rect.top >= frame.top - 2 && rect.bottom <= frame.bottom + 2;
        })
        .sort((a, b) => {
            const ra = a.getBoundingClientRect();
            const rb = b.getBoundingClientRect();
            return ra.top - rb.top || ra.left - rb.left;
        })[0] ?? null;
}

/**
 * Navegação espacial: escolhe o item mais próximo na direção pedida,
 * penalizando o desvio perpendicular (mesma ideia das TVs e consoles).
 */
export function nearest(root: HTMLElement, from: HTMLElement, direction: Direction) {
    const origin = from.getBoundingClientRect();
    const ox = origin.left + origin.width / 2;
    const oy = origin.top + origin.height / 2;
    let best: HTMLElement | null = null;
    let bestScore = Infinity;

    for (const el of focusables(root)) {
        if (el === from) continue;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        const vertical = direction === "up" || direction === "down";
        // distância na direção (borda a borda) e desvio perpendicular (centro a centro)
        const primary = direction === "up" ? origin.top - rect.bottom
            : direction === "down" ? rect.top - origin.bottom
            : direction === "left" ? origin.left - rect.right
            : rect.left - origin.right;
        const ahead = direction === "up" ? cy < oy - 1 : direction === "down" ? cy > oy + 1
            : direction === "left" ? cx < ox - 1 : cx > ox + 1;
        if (!ahead) continue;
        const cross = vertical ? Math.abs(cx - ox) : Math.abs(cy - oy);
        // itens alinhados na faixa da direção têm prioridade; fora dela, só um cone de ~45°
        const overlaps = vertical
            ? rect.left < origin.right && rect.right > origin.left
            : rect.top < origin.bottom && rect.bottom > origin.top;
        const gap = Math.max(primary, 0);
        if (!overlaps && cross > gap * 0.8 + 8) continue;
        if (primary < -Math.min(rect.height, origin.height) / 2 && vertical) continue;
        if (primary < -Math.min(rect.width, origin.width) / 2 && !vertical) continue;
        const score = overlaps ? gap + cross * 0.3 : 10_000 + gap + cross * 2;
        if (score < bestScore) {
            bestScore = score;
            best = el;
        }
    }
    return best;
}
