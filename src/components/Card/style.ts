import styled, { keyframes } from "styled-components";

const enter = keyframes`
    from { opacity: 0; transform: translateY(18px) scale(.96); }
`;

export const Container = styled.button<{ $color: string; $index: number; $animate: boolean }>`
    --tilt-x: 0deg;
    --tilt-y: 0deg;
    --glare-x: 50%;
    --glare-y: 50%;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    text-align: left;
    padding: 12px 12px 14px;
    border-radius: 16px;
    overflow: hidden;
    background:
        radial-gradient(130% 90% at 100% 0%, ${({ $color }) => $color}55 0%, transparent 60%),
        ${({ theme }) => theme.card};
    box-shadow: 0 0 0 1px ${({ $color }) => $color}40, 0 6px 18px -10px rgba(0, 0, 0, .5);
    transform: perspective(700px) rotateX(var(--tilt-x)) rotateY(var(--tilt-y));
    transition: transform .25s cubic-bezier(.2, .8, .2, 1), box-shadow .25s ease, background-color .3s ease;
    content-visibility: auto;
    contain-intrinsic-size: auto 210px;
    animation: ${enter} .45s cubic-bezier(.2, .8, .2, 1) backwards;
    animation-delay: ${({ $index }) => `${($index % 16) * 28}ms`};
    ${({ $animate }) => !$animate && "animation: none;"}

    /* pokébola marca d'água */
    &::before {
        content: "";
        position: absolute;
        right: -26px;
        top: -26px;
        width: 120px;
        aspect-ratio: 1;
        border-radius: 50%;
        background:
            radial-gradient(circle, transparent 0 13px, currentColor 14px 21px, transparent 22px),
            linear-gradient(transparent 46%, currentColor 46% 54%, transparent 54%);
        -webkit-mask: radial-gradient(circle, #000 0 57px, transparent 58px);
        mask: radial-gradient(circle, #000 0 57px, transparent 58px);
        box-shadow: inset 0 0 0 7px currentColor;
        color: ${({ $color }) => $color};
        opacity: .18;
        transition: transform .6s cubic-bezier(.2, .8, .2, 1);
    }

    &::after {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: inherit;
        background: radial-gradient(circle at var(--glare-x) var(--glare-y), rgba(255, 255, 255, .22), transparent 55%);
        opacity: 0;
        transition: opacity .25s ease;
        pointer-events: none;
    }

    @media (hover: hover) {
        &:hover {
            box-shadow: 0 0 0 1px ${({ $color }) => $color}90, 0 18px 30px -16px ${({ $color }) => $color};
        }
        &:hover::before { transform: rotate(120deg); }
        &:hover::after { opacity: 1; }
        &:hover img.loaded { transform: translateY(-6px) scale(1.07); }
    }

    &:active { transform: scale(.97); }
`;

export const Number = styled.span`
    font-family: ${({ theme }) => theme.fontPixel};
    font-size: .85rem;
    color: ${({ theme }) => theme.fontMuted};
`;

export const Art = styled.div`
    position: relative;
    aspect-ratio: 1;
    margin: 2px 8px 6px;

    img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        opacity: 0;
        transform: scale(.9);
        transition: opacity .35s ease, transform .4s cubic-bezier(.2, .8, .2, 1);
        filter: drop-shadow(0 8px 8px rgba(0, 0, 0, .25));
        user-select: none;
        -webkit-user-drag: none;
    }

    img.loaded {
        opacity: 1;
        transform: none;
    }
`;

export const Name = styled.h2`
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.2;
    margin-bottom: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

export const Types = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
`;

export const TypeBadge = styled.span<{ $color: string; $text: string }>`
    font-size: .7rem;
    font-weight: 600;
    letter-spacing: .02em;
    padding: 3px 8px;
    border-radius: 999px;
    color: ${({ $text }) => $text};
    background: ${({ $color }) => $color};
    ${({ $text }) => $text === "#ffffff" && "text-shadow: 0 1px 1px rgba(0, 0, 0, .35);"}
`;
