import { Container, Input } from "./style";

type inputComponet = {
    id?: string;
    type?: string;
    placeholder?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function InputComponent({ id, type, placeholder, onChange  }: inputComponet) {
    return (
        <Container>
            <Input placeholder={placeholder} type={type} id={id} onChange={onChange} />
        </Container>
    );
}