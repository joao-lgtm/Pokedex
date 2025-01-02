import { Button } from "../Button";
import { Container } from "./style";

export function ButtonSend({ underlined, setUnderlined, brokenWord }) {
    function send() {
        const inputElement = document.getElementById('inputLetra') as HTMLInputElement;
        const valorInput =  inputElement.value.toLowerCase();
        let letra = valorInput;

        let novaPalavraSub = [...underlined];

        for (let i = 0; i < brokenWord.length; i++) {
            for( let j = 0; j < letra.length; j++){
                if(letra[j] === brokenWord[i]){
                    novaPalavraSub[i] = letra[j];
                }
            }
        }

        
        setUnderlined(novaPalavraSub);
        
    }


    return (
        <Container>
            <Button name="Enviar" onClick={send}/>
        </Container>
    )

}