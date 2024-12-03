import { Container, Input } from "./style";

type inputComponet = {
    id?: string;
    type?: string;
    placeholder?: string;
}

export function InputComponent({ id, type, placeholder }: inputComponet) {
    return (
        <Container>
            <Input placeholder={placeholder} type={type} id={id} />
        </Container>
    );
}