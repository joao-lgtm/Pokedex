import { Fragment } from "react";
import { FaChevronRight } from "react-icons/fa";
import { artworkUrl, formatName } from "../../services/pokeapi";
import { EvoButton, EvolutionRow, Muted, Stage } from "./style";

type EvolutionProps = {
    stages: Array<Array<{ id: number; name: string }>>;
    current: number;
    onSelect: (name: string) => void;
};

export function Evolution({ stages, current, onSelect }: EvolutionProps) {
    if (stages.length < 2) return <Muted>Este Pokémon não evolui.</Muted>;

    return (
        // data-no-swipe: a rolagem horizontal da cadeia não troca de Pokémon; data-dpad-row: o cursor rola até o item
        <EvolutionRow data-no-swipe data-dpad-row>
            {stages.map((stage, i) => (
                <Fragment key={i}>
                    {i > 0 && <FaChevronRight className="arrow" aria-hidden style={{ animationDelay: `${i * 90 - 45}ms` }} />}
                    <Stage $branched={stage.length > 2}>
                        {stage.map((pokemon, j) => (
                            <EvoButton
                                key={pokemon.id}
                                $current={pokemon.id === current}
                                $order={i * 2 + j}
                                aria-current={pokemon.id === current ? "page" : undefined}
                                onClick={() => pokemon.id !== current && onSelect(pokemon.name)}
                            >
                                <img
                                    src={artworkUrl(pokemon.id)}
                                    alt=""
                                    width={72}
                                    height={72}
                                    loading="lazy"
                                    decoding="async"
                                    onError={(event) => (event.currentTarget.style.visibility = "hidden")}
                                />
                                <span>{formatName(pokemon.name)}</span>
                            </EvoButton>
                        ))}
                    </Stage>
                </Fragment>
            ))}
        </EvolutionRow>
    );
}
