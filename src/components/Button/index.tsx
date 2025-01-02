import { Container } from "./style";

export function Button({ name , onClick }: { name: string , onClick: () => void}) {
    return (
        <Container onClick={onClick}>
            {name}
        </Container>
    )
}