import { motion, useReducedMotion } from "motion/react";
import { formatName, type PokemonDetail } from "../../services/pokeapi";
import { StatList, StatRow, StatTotal, StatTrack } from "./style";

const LABELS: Record<string, string> = {
    hp: "HP",
    attack: "Ataque",
    defense: "Defesa",
    "special-attack": "At. Esp.",
    "special-defense": "Def. Esp.",
    speed: "Velocidade",
};

const MAX_STAT = 200;

function statColor(value: number) {
    if (value < 50) return "#f2545b";
    if (value < 80) return "#f7a034";
    if (value < 100) return "#f4d03f";
    if (value < 130) return "#5cc96b";
    return "#2fc6c0";
}

export function Stats({ stats }: { stats: PokemonDetail["stats"] }) {
    const reduced = useReducedMotion();
    const total = stats.reduce((sum, stat) => sum + stat.value, 0);

    return (
        <StatList>
            {stats.map((stat, i) => (
                <StatRow key={stat.name}>
                    <span className="label">{LABELS[stat.name] ?? formatName(stat.name)}</span>
                    <span className="value">{stat.value}</span>
                    <StatTrack>
                        <motion.div
                            className="fill"
                            style={{ background: statColor(stat.value) }}
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: Math.min(1, stat.value / MAX_STAT) }}
                            transition={reduced ? { duration: 0 } : { duration: 0.8, delay: 0.15 + i * 0.07, ease: [0.2, 0.8, 0.2, 1] }}
                        />
                    </StatTrack>
                </StatRow>
            ))}
            <StatTotal>
                <span>Total</span>
                <strong>{total}</strong>
            </StatTotal>
        </StatList>
    );
}
