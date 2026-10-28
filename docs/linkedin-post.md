# Post do LinkedIn · Pokédex

> Anexe `scripts/video/out/pokedex-linkedin.mp4` (gere com `yarn video`).

---

Transformei a Pokédex num aparelho que funciona dentro do navegador. 

Nos últimos dias reconstruí do zero um projeto antigo: uma Pokédex com os 1025 Pokémon, em que a interface inteira é o próprio aparelho, com lente, LEDs, D-pad e botões A/B que funcionam de verdade.

O que mais gostei de construir:
▸ Busca instantânea: o índice completo sai de 19 requisições paralelas à PokeAPI e fica em cache no navegador.
▸ Transições com a View Transitions API: a arte do card "voa" até a tela de detalhe.
▸ Web Audio: o cry de cada Pokémon toca e a lente do aparelho pulsa no ritmo do som.
▸ Quiz da Rotom, "Quem é esse Pokémon?": três níveis de dificuldade, dicas progressivas, uma TV que custa vidas para mostrar a silhueta e uma Rotom customizável com cores e adesivos.

Dificuldades que viraram aprendizado:
• Desempenho com 1025 itens: grade incremental, lazy-load das rotas e cache do índice.
• Tudo em pt-BR: montei um dataset estático com as descrições de 1025 espécies e 374 habilidades, carregado só quando é preciso.
• Navegação sem mouse: um cursor espacial guiado pelo D-pad funciona em qualquer tela, do celular de 360 px ao desktop.

Stack: React 18 · TypeScript · Vite · styled-components · Motion · React Router · PokeAPI · Vercel

Teste no navegador 👉 https://pokedex-beta-indol-89.vercel.app/
Código 👉 github.com/joao-lgtm/Pokedex

Feedbacks são bem-vindos!

#react #typescript #frontend #webdev #javascript
