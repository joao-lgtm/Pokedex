import { useNavigate } from "react-router-dom";
import { Container } from "./style";


export function Card({ entry_number, name, img } :  {entry_number: number ,name: string ,img: string}) {
    const navigation = useNavigate();

    function redirect(name: string) {
        navigation(`/pokemon/${name}`);
    }

    return (
        <Container>
            <div>
                <span>#{entry_number}</span>
                <h2>{name.toUpperCase()}</h2>
            </div>
            <img onClick={() => redirect(name)} src={img} alt={name} />
        </Container>
    );
}