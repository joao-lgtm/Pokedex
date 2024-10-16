interface Pokemon {
    id: number;
    name: string;
    base_experience: number;
    height: number;
    is_default: boolean;
    order: number;
    weight: number;
    abilities: Ability[];
    forms: Form[];
    game_indices: GameIndex[];
    held_items: HeldItem[];
    location_area_encounters: string;
    moves: Move[];
    species: Species;
    sprites: Sprites;
    versions: Versions;
  }
  
  interface Ability {
    is_hidden: boolean;
    slot: number;
    ability: Resource;
  }
  
  interface Form {
    name: string;
    url: string;
  }
  
  interface GameIndex {
    game_index: number;
    version: Resource;
  }
  
  interface HeldItem {
    item: Resource;
    version_details: VersionDetail[];
  }
  
  interface VersionDetail {
    rarity: number;
    version: Resource;
  }
  
  interface Move {
    move: Resource;
    version_group_details: VersionGroupDetail[];
  }
  
  interface VersionGroupDetail {
    level_learned_at: number;
    version_group: Resource;
    move_learn_method: Resource;
  }
  
  interface Species {
    name: string;
    url: string;
  }
  
  interface Sprites {
    back_default: string | null;
    back_female: string | null;
    back_shiny: string | null;
    back_shiny_female: string | null;
    front_default: string | null;
    front_female: string | null;
    front_shiny: string | null;
    front_shiny_female: string | null;
    other: OtherSprites;
  }
  
  interface OtherSprites {
    dream_world: DreamWorld;
    home: Home;
    "official-artwork": OfficialArtwork;
    showdown: Showdown;
  }
  
  interface DreamWorld {
    front_default: string | null;
    front_female: string | null;
  }
  
  interface Home {
    front_default: string | null;
    front_female: string | null;
    front_shiny: string | null;
    front_shiny_female: string | null;
  }
  
  interface OfficialArtwork {
    front_default: string;
    front_shiny: string;
  }
  
  interface Showdown {
    back_default: string | null;
    back_female: string | null;
    back_shiny: string | null;
    back_shiny_female: string | null;
    front_default: string | null;
    front_female: string | null;
    front_shiny: string | null;
    front_shiny_female: string | null;
  }
  
  interface Versions {
    "generation-i": GenerationI;
    "generation-ii": GenerationII;
    "generation-iii": GenerationIII;
    "generation-iv": GenerationIV;
    "generation-v": GenerationV;
    "generation-vi": GenerationVI;
    "generation-vii": GenerationVII;
    "generation-viii": GenerationVIII;
  }
  
  interface GenerationI {
    "red-blue": SpriteSet;
    yellow: SpriteSet;
  }
  
  interface GenerationII {
    crystal: SpriteSet;
    gold: SpriteSet;
    silver: SpriteSet;
  }
  
  interface GenerationIII {
    emerald: SpriteSet;
    "firered-leafgreen": SpriteSet;
    "ruby-sapphire": SpriteSet;
  }
  
  interface GenerationIV {
    "diamond-pearl": SpriteSet;
    "heartgold-soulsilver": SpriteSet;
    platinum: SpriteSet;
  }
  
  interface GenerationV {
    "black-white": AnimatedSprites;
  }
  
  interface GenerationVI {
    "omegaruby-alphasapphire": SpriteSet;
    "x-y": SpriteSet;
  }
  
  interface GenerationVII {
    icons: IconSprites;
    "ultra-sun-ultra-moon": SpriteSet;
  }
  
  interface GenerationVIII {
    icons: IconSprites;
  }
  
  interface SpriteSet {
    back_default: string | null;
    back_shiny: string | null;
    front_default: string | null;
    front_shiny: string | null;
    back_female?: string | null;
    front_female?: string | null;
  }
  
  interface AnimatedSprites extends SpriteSet {
    animated: SpriteSet;
  }
  
  interface IconSprites {
    front_default: string | null;
    front_female: string | null;
  }
  
  interface Resource {
    name: string;
    url: string;
  }
  