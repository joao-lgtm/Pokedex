import { useNavigate } from "react-router-dom";
import { Container, Id, ImgAndTypes, Name, Type, Types } from "./style";


export function Card({ entry_number, name, img, color, types }: {
    entry_number: number,
    name: string,
    img: string,
    color: string,
    types: Array<{ type: { name: string } }>
}) {
    const navigation = useNavigate();

    function redirect(name: string) {
        navigation(`/pokemon/${name}`);
    }

    function typePokemons(nameType: string) {
        switch (nameType) {
            case 'grass':
                return '#7c5';
            case 'fire':
                return '#f42';
            case 'water':
                return '#39f';
            case 'rock':
                return '#ba6';
            case 'electric':
                return '#fc3';
            case 'steel':
                return '#aab';
            case 'ground':
                return '#db5';
            case 'ice':
                return '#6cf';
            case 'fighting':
                return '#b54';
            case 'bug':
                return '#ab2';
            case 'poison':
                return '#a59';
            case 'psychic':
                return '#f59';
            case 'ghost':
                return '#66b';
            case 'dragon':
                return '#76e';
            case 'dark':
                return '#754';
            case 'fairy':
                return '#e9e';
            case 'normal':
                return '#aa9';
            case 'flying':
                return '#89f';
            default:
                return 'black';
        }
    }

    function backgroundcolor(type: string) {
        switch (type) {
            case 'grass':
                return '#8ad96a';
            case 'fire':
                return '#ff6d52';
            case 'water':
                return '#56aaff';
            case 'rock':
                return '#ba6';
            case 'electric':
                return '#fc3';
            case 'steel':
                return '#aab';
            case 'ground':
                return '#db5';
            case 'ice':
                return '#6cf';
            case 'fighting':
                return '#b54';
            case 'bug':
                return '#b1bd51';
            case 'poison':
                return '#a59';
            case 'psychic':
                return '#ff7bb0';
            case 'ghost':
                return '#66b';
            case 'dragon':
                return '#76e';
            case 'dark':
                return '#754';
            case 'fairy':
                return '#e9e';
            case 'normal':
                return '#aa9';
            case 'flying':
                return '#89f';
            default:
                return 'black';
        }
    }

    return (
        <Container $color={backgroundcolor(types[0].type.name)}>
            <Id $colorText={color}><span>#{entry_number}</span></Id>
            <Name>
                <h2>{name.toUpperCase()}</h2>
            </Name>
            <ImgAndTypes>
                <img onClick={() => redirect(name)} src={img} alt={name} />
                <Types>{
                    types.map((type, index) => (
                        <Type key={index} $types={typePokemons(type.type.name)}>{type.type.name}</Type>
                    ))}
                </Types>
            </ImgAndTypes>
        </Container>
    );
}