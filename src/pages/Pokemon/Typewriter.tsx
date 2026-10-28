import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";
import { Flavor } from "./style";

/** Texto digitado letra a letra; o restante fica invisível para não mexer no layout. */
export function Typewriter({ text }: { text: string }) {
    const reduced = useReducedMotion();
    const [count, setCount] = useState(0);
    const done = reduced || count >= text.length;

    useEffect(() => {
        if (done) return;
        const timer = setInterval(() => setCount((value) => value + 1), 22);
        return () => clearInterval(timer);
    }, [done]);

    const shown = done ? text.length : count;

    return (
        <Flavor>
            <span className="sr-only">{text}</span>
            <span aria-hidden>
                {text.slice(0, shown)}
                {!done && <span className="caret" />}
                <span className="rest">{text.slice(shown)}</span>
            </span>
        </Flavor>
    );
}
