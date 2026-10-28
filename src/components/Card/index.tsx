import { memo, useRef, type PointerEvent } from "react";
import { artworkUrl, formatName, formatNumber, loadPokemonDetail, type PokemonIndexEntry } from "../../services/pokeapi";
import { typeColor, typeLabel, typeTextColor } from "../../style/types";
import { Art, Container, Name, Number, TypeBadge, Types } from "./style";

type CardProps = {
    pokemon: PokemonIndexEntry;
    index: number;
    animate: boolean;
    /** Recebe a <img> da arte para aplicar view-transition-name antes de navegar. */
    onOpen: (pokemon: PokemonIndexEntry, art: HTMLImageElement | null) => void;
    transitionName?: string;
};

export const Card = memo(function Card({ pokemon, index, animate, onOpen, transitionName }: CardProps) {
    const ref = useRef<HTMLButtonElement>(null);
    const art = useRef<HTMLImageElement>(null);
    const color = typeColor(pokemon.types[0]);

    // tilt 3D via variáveis CSS: nenhum re-render no movimento do ponteiro
    function onPointerMove(event: PointerEvent<HTMLButtonElement>) {
        if (event.pointerType !== "mouse" || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        ref.current.style.setProperty("--tilt-x", `${(0.5 - y) * 12}deg`);
        ref.current.style.setProperty("--tilt-y", `${(x - 0.5) * 14}deg`);
        ref.current.style.setProperty("--glare-x", `${x * 100}%`);
        ref.current.style.setProperty("--glare-y", `${y * 100}%`);
    }

    function onPointerLeave() {
        ref.current?.style.setProperty("--tilt-x", "0deg");
        ref.current?.style.setProperty("--tilt-y", "0deg");
    }

    return (
        <Container
            ref={ref}
            $color={color}
            $index={index}
            $animate={animate}
            onPointerMove={onPointerMove}
            onPointerLeave={onPointerLeave}
            onPointerEnter={() => loadPokemonDetail(pokemon.id).catch(() => undefined)}
            onClick={() => onOpen(pokemon, art.current)}
            aria-label={`${formatName(pokemon.name)} ${formatNumber(pokemon.id)}`}
        >
            <Number>{formatNumber(pokemon.id)}</Number>
            <Art>
                <img
                    ref={art}
                    src={artworkUrl(pokemon.id)}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    width={200}
                    height={200}
                    style={transitionName ? { viewTransitionName: transitionName } : undefined}
                    onLoad={(event) => event.currentTarget.classList.add("loaded")}
                    onError={(event) => event.currentTarget.classList.add("loaded")}
                />
            </Art>
            <Name>{formatName(pokemon.name)}</Name>
            <Types>
                {pokemon.types.map((type) => (
                    <TypeBadge key={type} $color={typeColor(type)} $text={typeTextColor(type)}>{typeLabel(type)}</TypeBadge>
                ))}
            </Types>
        </Container>
    );
});
