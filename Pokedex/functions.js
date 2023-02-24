let ids                 = document.getElementById('tabela-poke');
let pokemon             = document.getElementById('pokemon');
let imagem_pokemon      = document.getElementById('imagem-pokemon');
let moves_id            = document.getElementById('moves-id');
let type_id             = document.getElementById('type-id');
let poke                = document.createElement('span');
let img                 = document.createElement('img');
let img_type            = document.createElement('img');
let img_type2           = document.createElement('img');
let species_old = ''
let s = []

const busca_pokemon = () => document.querySelectorAll("p").forEach(
   element =>{
      element.addEventListener("click",  function pega_id(event){
      const el    = event.target;
      const id    = el.id;
      const url2  = `https://pokeapi.co/api/v2/pokemon/${id}/`;

      fetch(url2)
      .then((resp) => resp.json())
      .then(function(tes){
         poke.innerHTML =  tes.species.name;
         img.src        =  tes.sprites.front_default;
         types          =  tes.types
         img_type.src   = 'img/' + types[0].type.name + '.png'
         
         let moves   = tes.moves
         

         for (var i = 0; i < moves.length; i++) {
            var pke_moves = document.createElement("p");
            var newText = document.createTextNode(moves[i]);
            pke_moves.appendChild(newText);
            moves_id.appendChild(pke_moves);
          }
         // moves.forEach(element => {
         //   let pke_moves  = document.createElement('p');
         //    let species = tes.species.name

         //    pke_moves.innerText = element.move.name

         //    moves_id.appendChild(pke_moves); 
         // });

         
         
         
         img_type.setAttribute('id', 'img_type');
         img.setAttribute('id', 'imagem-pokemon');
         poke.setAttribute('id', 'name-pokemon');
         imagem_pokemon.appendChild(img);
         pokemon.appendChild(poke);
         type_id.appendChild(img_type)
         
         if(types.length > 1){
            img_type2.src = 'img/'+ types[1].type.name + '.png'
            type_id.appendChild(img_type2)
            img_type2.setAttribute('id', 'img_type');
         }else {
            img_type2.remove()
         }  
      })
     
   }) 
});
const url = 'https://pokeapi.co/api/v2/pokedex/2';

fetch(url)

.then((resp) => resp.json())

.then(function(data) {
   let pokemons_infos = data.pokemon_entries;
   pokemons_infos.forEach(element => {
      let p          = document.createElement('p');
      let p2         = document.createElement('p');
      let tr         = document.createElement('tr');
      let td         = document.createElement('td');
      let td2        = document.createElement('td'); 
      p.innerHTML    = element.entry_number;
      p2.innerHTML   = element.pokemon_species.name;
      p2.id          = element.pokemon_species.name;

      tr.setAttribute('id', 'id');
      td2.setAttribute('id', 'name-pokemon-table');
      p2.setAttribute('onclick', 'busca_pokemon()');
      ids.appendChild(tr);
      tr.appendChild(td);
      tr.appendChild(td2);
      td.appendChild(p);
      td2.appendChild(p2);

 

      // id.appendChild(td)
      // names.appendChild(p2)
      
   });
 

})



.catch(function(err) {
console.log(err)
});

