import { useEffect, useState } from "react";
import { Input } from "../../components/Input/style";
import { ButtonSend } from "../../components/ButtonGame";
import { Container, Content } from "./style";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";

export function Game() {
    const [palavra, setPalavra] = useState("banana");
    const [palavraQuebrada, setPalavraQuebrada] = useState([]);
    const [palavraSub, setPalavraSub] = useState([]);
    const [letrasAcertadas, setLetrasAcertadas] = useState([]);
    const [letraEscolhida, setLetraEscolhida] = useState("");;

    useEffect(() => {
        convertpalavraArray();
    }, [])

    function convertpalavraArray() {
        let letras = palavra.split('');
        setPalavraQuebrada(letras);
        setPalavraSub(letras.map(() => '_'));
    }



    return (
        <Container>
            <Header />
            <Content>
                <div>
                    {palavraSub.map((letra, index) => (
                        <div key={index}>{letra}</div>
                    ))}
                </div>
                <div>
                    <Input id="inputLetra" type="text" />
                </div>

                <div>
                    <ButtonSend palavraSub={palavraSub} setPalavraSub={setPalavraSub} palavraQuebrada={palavraQuebrada} />
                </div>
            </Content>

            <Footer />
        </Container>
    );
}