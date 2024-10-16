import { useParams } from "react-router-dom";
import { Container } from "./style";

export function Pokemon() {
    const { name } = useParams<{ name: string }>();
    return (
        <Container>
            <h1>{name}</h1>
        </Container>
    );
}