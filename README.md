<p align="center">
  <img src="public/logo.svg" alt="Logo da Pokédex" width="120">
</p>

<h1 align="center">Pokédex</h1>

Uma Pokédex que funciona como um aparelho dentro do navegador. A interface inteira é o próprio dispositivo: lente, LEDs, D-pad e botões A/B funcionam de verdade. Tem os 1025 Pokémon, uma página de detalhe completa e um quiz, "Quem é esse Pokémon?", em que o aparelho vira uma Rotom.

**Demo:** [pokedex-beta-indol-89.vercel.app](https://pokedex-beta-indol-89.vercel.app/)

## Funcionalidades

- **Home:** busca instantânea por nome ou número, filtro pelos 18 tipos e grade incremental. O índice com os 1025 Pokémon sai de 19 requisições paralelas à PokeAPI e fica em cache no `localStorage`.
- **Detalhe:**
  - A arte "voa" do card até o visor (View Transitions API).
  - Cry com equalizador.
  - Versão shiny.
  - Descrição com efeito de máquina de escrever.
  - Stats animados.
  - Cadeia de evolução clicável, inclusive as ramificadas, como a do Eevee.
  - Troca de Pokémon com ←/→ ou swipe.
- **Chassi:**
  - O D-pad move um cursor espacial por qualquer tela; A confirma e B volta.
  - A lente pulsa com o áudio (Web Audio API).
  - Boot animado com som de ligar, tema claro/escuro e controle de volume.
  - Botão de paleta para customizar a Pokédex: 8 cores de carcaça e adesivos arrastáveis.
- **Quiz da Rotom:**
  - Modos Fácil, Médio e Difícil, com dicas progressivas: tipos, geração, altura e peso, até a entrada da Pokédex censurada, habitat, formato e cor.
  - Ligar a TV para ver a silhueta custa vidas.
  - Placar com acertos, sequência e recorde.
  - Customização da Rotom: 8 cores de carcaça e adesivos arrastáveis, separadas das da Pokédex.
- **Tudo em pt-BR:** descrições de 1025 espécies e 374 habilidades, num dataset estático carregado sob demanda.
- **Acessibilidade e responsividade:**
  - Navegação completa por teclado.
  - Respeita `prefers-reduced-motion`.
  - Layout mobile-first, do celular de 360 px ao desktop.

## Stack

| Área | Tecnologia |
|------|------------|
| UI | React 18 + TypeScript |
| Build | Vite |
| Estilo | styled-components (tema claro/escuro) |
| Animação | Motion, View Transitions API |
| Rotas | React Router (rotas com lazy-load) |
| Áudio | Web Audio API (`AnalyserNode` e `GainNode`) |
| Dados | [PokeAPI](https://pokeapi.co) + dataset pt-BR estático |
| Deploy | Vercel + Web Analytics + Speed Insights |

## Como rodar

Pré-requisitos: Node 18+ e Yarn.

```bash
yarn          # instala as dependências
yarn dev      # servidor de desenvolvimento em http://localhost:5173
```

| Script | O que faz |
|--------|-----------|
| `yarn dev` | Servidor de desenvolvimento |
| `yarn build` | Checagem de tipos e build de produção em `dist/` |
| `yarn preview` | Serve o build de produção |
| `yarn lint` | ESLint |
| `yarn video` | Grava o vídeo de demonstração (veja abaixo) |

## Estrutura

```
src/
├── components/
│   ├── Device/     # chassi: lente, LEDs, D-pad, cursor espacial, adesivos
│   ├── Card/       # card da Home
│   └── Rotom/      # TV do quiz
├── hooks/          # useDevice (lente, áudio, controles, navegação com View Transitions)
├── pages/
│   ├── Home/       # busca, filtros e grade
│   ├── Pokemon/    # detalhe, stats, evolução
│   └── Game/       # quiz, dicas e customização
├── services/       # PokeAPI, perfis dos aparelhos, contador de visitas
└── style/          # tema, tipos e estilos globais
public/data/pt-BR/  # dataset de traduções (carregado sob demanda)
scripts/
├── i18n/           # extração e montagem do dataset pt-BR
└── video/          # gravação do vídeo de demonstração
```

## Como funciona

- **Dados:**
  - `services/pokeapi.ts` concentra o acesso à PokeAPI.
  - O índice (nome, número e tipos) é montado com `Promise.all` sobre a lista de espécies e as 18 listas de tipos, e é salvo no `localStorage`.
  - O detalhe de cada Pokémon é buscado só quando é aberto, e o texto em pt-BR vem de `public/data/pt-BR`.
- **Chassi:**
  - `components/Device` desenha o aparelho e expõe, via `useDevice`, a lente, os LEDs, o áudio e os controles.
  - Cada página registra o que os botões fazem com `useControls`.
  - O cursor do D-pad escolhe o elemento mais próximo na direção pressionada (`spatial.ts`).
- **Quiz:**
  - `pages/Game/hints.ts` gera as dicas de cada modo a partir do detalhe do Pokémon e censura o nome nas entradas da Pokédex.
  - Pokédex e Rotom têm perfis separados (cor e adesivos), salvos por uma interface de repositório (`services/deviceProfile.ts`). O aparelho ativo vem da rota. Hoje os perfis usam `sessionStorage`, mas a implementação pode ser trocada por uma API.

## Traduções pt-BR

```bash
node scripts/i18n/extract.mjs   # baixa os textos em inglês para scripts/i18n/source/
# traduza para scripts/i18n/pt-BR/ (species-1.json, species-2.json, abilities.json)
node scripts/i18n/build.mjs     # gera public/data/pt-BR/
```

## Vídeo de demonstração

`yarn video` faz o build, sobe o `vite preview` na porta 4173 e usa o Playwright para navegar pela aplicação, com legendas e trechos de código por cima. O resultado é `scripts/video/out/pokedex-linkedin.mp4`: 1080x1350, 30 fps, sem áudio.

```bash
VIDEO_URL=meu-site.vercel.app yarn video   # muda o link mostrado no fechamento
```

A gravação bloqueia o contador de visitas e o Analytics.

## Deploy

O projeto está pronto para a Vercel:
- O `vercel.json` manda todas as rotas para o `index.html`, então links diretos como `/game` ou `/pokemon/pikachu` funcionam.
- Para ver os acessos e as métricas de desempenho (LCP, INP, CLS), ative **Analytics** e **Speed Insights** no painel do projeto.
- O contador público de visitantes, no rodapé da tela, usa a API gratuita [Abacus](https://abacus.jasoncameron.dev).

---

Dados e imagens: [PokeAPI](https://pokeapi.co). Pokémon e os nomes relacionados são marcas registradas de Nintendo, Game Freak e The Pokémon Company. Projeto de estudo, sem fins comerciais.
