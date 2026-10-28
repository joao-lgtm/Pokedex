import { useEffect, useState } from "react";
import { Container } from "./style";

const TURN_OFF_MS = 500;

type Props = { sprite: string; revealed: boolean; power: boolean; onPower: () => void };
export function RotomScreen({ sprite, revealed, power, onPower }: Props) {
    // a arte nova só entra depois da TV terminar de desligar: nada da próxima rodada vaza
    const [shown, setShown] = useState(sprite);
    useEffect(() => {
        if (sprite === shown) return;
        if (power) { setShown(sprite); return; }
        const timer = setTimeout(() => setShown(sprite), TURN_OFF_MS);
        return () => clearTimeout(timer);
    }, [sprite, shown, power]);
    const pending = sprite !== shown;

    return <Container>
        <div className="glass"><div className={`broadcast ${power ? "on" : "off"}`}>
            <span className="channel" aria-hidden>ROTOM TV · QUIZ</span>
            {/* key: cada rodada monta uma img nova já como silhueta, sem herdar a transição da revelada */}
            <img key={shown} src={shown} alt={revealed ? "Pokémon revelado" : "Silhueta do Pokémon misterioso"} draggable={false} className={revealed && !pending ? "revealed" : "silhouette"} />
            {revealed && !pending && <div className="flash" aria-hidden />}
        </div></div>
        <button className="power" onClick={onPower} aria-label={power ? "Desligar tela da Rotom" : "Ligar tela da Rotom"} aria-pressed={power}>⏻</button>
    </Container>;
}
