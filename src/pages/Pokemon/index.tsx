import { useEffect, useLayoutEffect, useRef, useState, type TouchEvent } from "react";
import { useParams } from "react-router-dom";
import { FaArrowLeft, FaStar, FaVolumeUp } from "react-icons/fa";
import { useControls, useDevice, useScreenNavigate } from "../../hooks/useDevice";
import { rememberOpened } from "../Home/session";
import {
    MAX_POKEMON,
    artworkUrl,
    formatName,
    formatNumber,
    loadEvolutionChain,
    loadPokemonDetail,
    loadPokemonIndex,
    preloadImage,
    type PokemonDetail,
    type PokemonIndexEntry,
} from "../../services/pokeapi";
import { typeColor, typeLabel, typeTextColor } from "../../style/types";
import { Evolution } from "./Evolution";
import { Stats } from "./Stats";
import { Typewriter } from "./Typewriter";
import {
    Abilities,
    ActionButton,
    Actions,
    Art,
    Burst,
    Container,
    Equalizer,
    Facts,
    Header,
    IconButton,
    Panel,
    Pokeball,
    Rings,
    Seal,
    Section,
    SkeletonLine,
    Status,
    TypeBadge,
    Visor,
    VisorTop,
} from "./style";

type Stages = Awaited<ReturnType<typeof loadEvolutionChain>>;

const CRY_DURATION = 1500;
const SWIPE_DISTANCE = 70;

// Resolve nome da rota -> id (e vice-versa) sem esperar a rede, para a arte
// já existir no primeiro render e voar da Home via View Transition.
const byName = new Map<string, PokemonIndexEntry>();
const byId = new Map<number, PokemonIndexEntry>();

function rememberIndex() {
    return loadPokemonIndex().then((entries) => {
        for (const entry of entries) {
            byName.set(entry.name, entry);
            byId.set(entry.id, entry);
        }
    });
}

rememberIndex().catch(() => undefined);

function formatMeasure(value: number) {
    return value.toLocaleString("pt-BR", { maximumFractionDigits: 1 });
}

export function Pokemon() {
    const { name = "" } = useParams<{ name: string }>();
    const key = name.toLowerCase();
    const { screenRef, playCry, blink } = useDevice();
    const navigate = useScreenNavigate();

    const [loaded, setLoaded] = useState<{ key: string; detail: PokemonDetail } | null>(null);
    const [failed, setFailed] = useState<string | null>(null);
    const [attempt, setAttempt] = useState(0);
    const [chain, setChain] = useState<{ url: string; stages: Stages } | null>(null);
    const [shinyFor, setShinyFor] = useState<string | null>(null);
    const [burst, setBurst] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [, setIndexReady] = useState(byId.size > 0);
    const playTimer = useRef(0);
    const touch = useRef<{ x: number; y: number } | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const fresh = loaded?.key === key ? loaded.detail : null;
    // ao trocar de Pokémon o painel antigo fica (esmaecido) até o novo chegar: nada pisca
    const detail = fresh ?? loaded?.detail ?? null;
    const stale = !fresh && detail !== null;
    const entry = byName.get(key) ?? (/^\d+$/.test(key) ? byId.get(Number(key)) : undefined);
    const id = fresh?.id ?? entry?.id ?? null;
    const types = fresh?.types ?? entry?.types ?? [];
    const color = typeColor(types[0] ?? "normal");
    const shiny = shinyFor === key;
    const error = failed === key && !fresh;
    const chainUrl = fresh?.evolutionChainUrl ?? null;
    const stages = chain?.stages ?? null;
    const staleChain = !stale && chain?.url !== chainUrl;
    const notFound = error && !id;

    useEffect(() => {
        if (byId.size) return;
        rememberIndex().then(() => setIndexReady(true)).catch(() => undefined);
    }, []);

    useEffect(() => {
        let active = true;
        blink("busy");

        (async () => {
            if (!byName.has(key)) await rememberIndex().catch(() => undefined);
            // pela id: nomes de espécie como "deoxys" não existem no endpoint /pokemon
            const next = await loadPokemonDetail(byName.get(key)?.id ?? key);
            if (!active) return;
            setLoaded({ key, detail: next });
            rememberOpened(next.id);
            blink("success");
            preloadImage(artworkUrl(next.id, true));
            for (const neighbor of [next.id - 1, next.id + 1]) {
                if (neighbor < 1 || neighbor > MAX_POKEMON) continue;
                preloadImage(artworkUrl(neighbor));
                loadPokemonDetail(neighbor).catch(() => undefined);
            }
        })().catch(() => {
            if (!active) return;
            setFailed(key);
            blink("error");
        });

        return () => {
            active = false;
        };
    }, [key, attempt, blink]);

    useEffect(() => {
        if (!chainUrl) return;
        let active = true;
        loadEvolutionChain(chainUrl)
            .then((result) => active && setChain({ url: chainUrl, stages: result }))
            .catch(() => undefined);
        return () => {
            active = false;
        };
    }, [chainUrl]);

    useLayoutEffect(() => {
        screenRef.current?.scrollTo({ top: 0 });
    }, [key, screenRef]);

    // altura útil da tela: o visor sticky do desktop se ajusta a ela
    useLayoutEffect(() => {
        const screen = screenRef.current;
        const container = containerRef.current;
        if (!screen || !container) return;
        const update = () => container.style.setProperty("--screen-h", `${screen.clientHeight}px`);
        update();
        const observer = new ResizeObserver(update);
        observer.observe(screen);
        return () => observer.disconnect();
    }, [screenRef, notFound]);

    useEffect(() => {
        const timer = playTimer;
        return () => clearTimeout(timer.current);
    }, []);

    function retry() {
        setFailed(null);
        setAttempt((value) => value + 1);
    }

    function cry() {
        if (!id) return;
        playCry(id);
        setPlaying(true);
        clearTimeout(playTimer.current);
        playTimer.current = window.setTimeout(() => setPlaying(false), CRY_DURATION);
    }

    function toggleShiny() {
        setShinyFor(shiny ? null : key);
        setBurst((value) => value + 1);
    }

    function step(offset: number) {
        if (!id) return;
        const target = id + offset;
        if (target < 1 || target > MAX_POKEMON) return;
        navigate(`/pokemon/${byId.get(target)?.name ?? target}`, { replace: true });
    }

    function back() {
        // entrou direto pela URL: não há para onde voltar no histórico
        const index = (window.history.state as { idx?: number } | null)?.idx ?? 0;
        navigate(index > 0 ? -1 : "/");
    }

    useControls({
        left: () => step(-1),
        right: () => step(1),
        a: cry,
        b: back,
    });

    function onTouchStart(event: TouchEvent) {
        const point = event.touches[0];
        const ignore = event.touches.length > 1 || (event.target as HTMLElement).closest("[data-no-swipe]");
        touch.current = ignore ? null : { x: point.clientX, y: point.clientY };
    }

    function onTouchEnd(event: TouchEvent) {
        const start = touch.current;
        touch.current = null;
        if (!start) return;
        const point = event.changedTouches[0];
        const dx = point.clientX - start.x;
        const dy = point.clientY - start.y;
        if (Math.abs(dx) > SWIPE_DISTANCE && Math.abs(dx) > Math.abs(dy) * 1.8) step(dx < 0 ? 1 : -1);
    }

    if (notFound) {
        return (
            <Status>
                <p>Não consegui encontrar esse Pokémon...</p>
                <button onClick={retry}>Tentar de novo</button>
                <button onClick={back}>Voltar</button>
            </Status>
        );
    }

    // nome da espécie (índice), não da forma padrão: "Deoxys", não "Deoxys Normal"
    const speciesName = (pokemon: PokemonDetail) => formatName(byId.get(pokemon.id)?.name ?? pokemon.name);
    // o visor já mostra o Pokémon novo; o painel esmaecido ainda é o anterior
    const displayName = fresh ? speciesName(fresh) : formatName(entry?.name ?? key);

    return (
        <Container ref={containerRef} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            <Visor $color={color} aria-label={`Visor: ${displayName}`}>
                <VisorTop>
                    <IconButton onClick={back} aria-label="Voltar">
                        <FaArrowLeft />
                    </IconButton>
                    {id && <span className="number">{formatNumber(id)}</span>}
                </VisorTop>

                <Rings aria-hidden>
                    <span />
                    <span />
                    <span />
                </Rings>

                <Art>
                    {id ? (
                        <img
                            src={artworkUrl(id, shiny)}
                            alt={shiny ? `${displayName} shiny` : displayName}
                            width={475}
                            height={475}
                            decoding="async"
                            style={{ viewTransitionName: "pokemon-art" }}
                        />
                    ) : (
                        <Pokeball aria-label="Carregando" />
                    )}
                    {burst > 0 && (
                        <Burst key={burst} aria-hidden>
                            {Array.from({ length: 10 }, (_, i) => <i key={i} />)}
                        </Burst>
                    )}
                </Art>

                <Actions>
                    <ActionButton onClick={cry} disabled={!id} $active={playing} $color={color} aria-label="Tocar o grito">
                        <FaVolumeUp />
                        <Equalizer $playing={playing} aria-hidden>
                            <i /><i /><i /><i /><i />
                        </Equalizer>
                    </ActionButton>
                    <ActionButton onClick={toggleShiny} disabled={!id} $active={shiny} $color={color} aria-pressed={shiny}>
                        <FaStar />
                        Shiny
                    </ActionButton>
                </Actions>
            </Visor>

            <Panel $stale={stale} aria-busy={stale || undefined}>
                {error ? (
                    <Status>
                        <p>Sem sinal com o Professor Carvalho...</p>
                        <button onClick={retry}>Tentar de novo</button>
                    </Status>
                ) : !detail ? (
                    <Section aria-busy>
                        <SkeletonLine $width="30%" />
                        <SkeletonLine $width="65%" $height={34} />
                        <SkeletonLine $width="45%" />
                        <SkeletonLine $height={90} />
                        <SkeletonLine $height={140} />
                    </Section>
                ) : (
                    <>
                        <Header>
                            <span className="number">{formatNumber(detail.id)}</span>
                            <h1>{speciesName(detail)}</h1>
                            {detail.genus && <p className="genus">{detail.genus}</p>}
                            <div className="badges">
                                {detail.types.map((type) => (
                                    <TypeBadge key={type} $color={typeColor(type)} $text={typeTextColor(type)}>{typeLabel(type)}</TypeBadge>
                                ))}
                                {(detail.isLegendary || detail.isMythical) && (
                                    <Seal $mythical={detail.isMythical}>{detail.isMythical ? "Mítico" : "Lendário"}</Seal>
                                )}
                            </div>
                        </Header>

                        <Section $delay={1}>
                            <h2>Registro da Pokédex</h2>
                            <Typewriter key={detail.id} text={detail.flavorText || "Nenhum registro encontrado."} />
                        </Section>

                        <Section $delay={2}>
                            <Facts>
                                <div>
                                    <dt>Altura</dt>
                                    <dd>{formatMeasure(detail.height)} m</dd>
                                </div>
                                <div>
                                    <dt>Peso</dt>
                                    <dd>{formatMeasure(detail.weight)} kg</dd>
                                </div>
                                <div>
                                    <dt>Captura</dt>
                                    <dd>{detail.captureRate}</dd>
                                </div>
                            </Facts>
                        </Section>

                        <Section $delay={3}>
                            <h2>Habilidades</h2>
                            <Abilities>
                                {detail.abilities.map((ability) => (
                                    <li key={ability.name}>
                                        {ability.label}
                                        {ability.hidden && <small>Oculta</small>}
                                    </li>
                                ))}
                            </Abilities>
                        </Section>

                        <Section $delay={4}>
                            <h2>Status base</h2>
                            <Stats key={detail.id} stats={detail.stats} />
                        </Section>

                        {stages && (
                            <Section $delay={5} $stale={staleChain}>
                                <h2>Evolução</h2>
                                <Evolution
                                    stages={stages}
                                    current={detail.id}
                                    onSelect={(next) => navigate(`/pokemon/${next}`)}
                                />
                            </Section>
                        )}
                    </>
                )}
            </Panel>
        </Container>
    );
}
