import { useCallback, useDeferredValue, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { Card } from "../../components/Card";
import { useControls, useDevice, useScreenNavigate } from "../../hooks/useDevice";
import { loadPokemonIndex, loadTranslations, type PokemonIndexEntry } from "../../services/pokeapi";
import { TYPES, typeColor, typeLabel } from "../../style/types";
import { PAGE, session } from "./session";
import { Chip, Chips, Container, Grid, Pokeball, SearchBox, Sentinel, Skeleton, Status, Toolbar } from "./style";

const FILTERS: string[] = ["", ...TYPES];

export function Home() {
    const { screenRef, blink, setLensLevel } = useDevice();
    const navigate = useScreenNavigate();
    const [index, setIndex] = useState<PokemonIndexEntry[] | null>(null);
    const [error, setError] = useState(false);
    const [query, setQuery] = useState(session.query);
    const [type, setType] = useState(session.type);
    const [visible, setVisible] = useState(session.visible);
    const sentinel = useRef<HTMLDivElement>(null);
    const animate = useRef(!session.animated);
    const deferredQuery = useDeferredValue(query);

    const load = useCallback(() => {
        setError(false);
        blink("busy");
        loadPokemonIndex()
            .then((entries) => {
                setIndex(entries);
                blink("success");
                // textos pt-BR do detalhe, em segundo plano
                (window.requestIdleCallback ?? setTimeout)(() => void loadTranslations());
            })
            .catch(() => {
                setError(true);
                blink("error");
            });
    }, [blink]);

    useEffect(load, [load]);

    useEffect(() => () => setLensLevel(0), [setLensLevel]);

    const results = useMemo(() => {
        if (!index) return [];
        const term = deferredQuery.trim().toLowerCase().replace(/^#0*/, "");
        return index.filter((pokemon) => {
            if (type && !pokemon.types.includes(type)) return false;
            if (!term) return true;
            return /^\d+$/.test(term) ? String(pokemon.id).startsWith(term) : pokemon.name.includes(term);
        });
    }, [index, deferredQuery, type]);

    useEffect(() => {
        session.query = query;
        session.type = type;
        session.visible = visible;
    }, [query, type, visible]);

    // volta para a mesma posição da lista ao retornar do detalhe
    useLayoutEffect(() => {
        if (index && screenRef.current) screenRef.current.scrollTop = session.scrollTop;
    }, [index, screenRef]);

    useEffect(() => {
        const screen = screenRef.current;
        if (!screen) return;
        const onScroll = () => (session.scrollTop = screen.scrollTop);
        screen.addEventListener("scroll", onScroll, { passive: true });
        return () => screen.removeEventListener("scroll", onScroll);
    }, [screenRef]);

    // renderização incremental: mais cards quando o fim da lista se aproxima
    useEffect(() => {
        const target = sentinel.current;
        if (!target || !screenRef.current) return;
        const observer = new IntersectionObserver(
            ([entry]) => entry.isIntersecting && setVisible((count) => count + PAGE),
            { root: screenRef.current, rootMargin: "800px 0px" },
        );
        observer.observe(target);
        return () => observer.disconnect();
    }, [screenRef, index, results.length]);

    useEffect(() => {
        if (index) session.animated = true;
    }, [index]);

    function changeFilter(next: { query?: string; type?: string }) {
        if (next.query !== undefined) setQuery(next.query);
        if (next.type !== undefined) setType(next.type);
        setVisible(PAGE);
        animate.current = true;
        screenRef.current?.scrollTo({ top: 0 });
    }

    const open = useCallback((pokemon: PokemonIndexEntry, art: HTMLImageElement | null) => {
        session.lastOpened = pokemon.id;
        if (art) art.style.viewTransitionName = "pokemon-art";
        navigate(`/pokemon/${pokemon.name}`);
    }, [navigate]);

    useControls({
        left: () => changeFilter({ type: FILTERS[(FILTERS.indexOf(type) - 1 + FILTERS.length) % FILTERS.length] }),
        right: () => changeFilter({ type: FILTERS[(FILTERS.indexOf(type) + 1) % FILTERS.length] }),
        a: () => results[0] && open(results[0], null),
    });

    const shown = results.slice(0, visible);

    return (
        <Container>
            <Toolbar data-sticky>
                <SearchBox>
                    <FaSearch size={15} />
                    <input
                        type="search"
                        inputMode="search"
                        enterKeyHint="search"
                        placeholder="Buscar por nome ou número"
                        value={query}
                        onChange={(event) => changeFilter({ query: event.target.value })}
                        onKeyDown={(event) => event.key === "Enter" && results[0] && open(results[0], null)}
                        aria-label="Buscar Pokémon"
                    />
                    {index && <span className="count">{results.length} / {index.length}</span>}
                </SearchBox>
                <Chips role="toolbar" aria-label="Filtrar por tipo" data-dpad-row>
                    <Chip $color="#8f97ab" $active={!type} onClick={() => changeFilter({ type: "" })}>Todos</Chip>
                    {TYPES.map((name) => (
                        <Chip
                            key={name}
                            $color={typeColor(name)}
                            $active={type === name}
                            onClick={() => changeFilter({ type: type === name ? "" : name })}
                        >
                            {typeLabel(name)}
                        </Chip>
                    ))}
                </Chips>
            </Toolbar>

            {error ? (
                <Status>
                    <p>Sem sinal com o Professor Carvalho...</p>
                    <button onClick={load}>Tentar de novo</button>
                </Status>
            ) : !index ? (
                <Grid aria-busy>
                    {Array.from({ length: 12 }, (_, i) => <Skeleton key={i} />)}
                </Grid>
            ) : results.length === 0 ? (
                <Status>
                    <Pokeball />
                    <p>Nenhum Pokémon encontrado.</p>
                </Status>
            ) : (
                <Grid>
                    {shown.map((pokemon, i) => (
                        <Card
                            key={pokemon.id}
                            pokemon={pokemon}
                            index={i}
                            animate={animate.current}
                            onOpen={open}
                            transitionName={pokemon.id === session.lastOpened ? "pokemon-art" : undefined}
                        />
                    ))}
                </Grid>
            )}
            {visible < results.length && <Sentinel ref={sentinel} />}
        </Container>
    );
}
