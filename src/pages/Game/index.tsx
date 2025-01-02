import { useEffect, useState } from "react";
import { Input } from "../../components/Input/style";
import { ButtonSend } from "../../components/ButtonGame";
import { Container, Content, ImageTip, Letters, LetterSpace, SendContent, WordContent } from "./style";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { api } from "../../services/api";
import { Rotom } from "../../components/Rotom";

export function Game() {
    const [brokenWord, setBrokenWord] = useState<string[]>([]);
    const [underlined, setUnderlined] = useState<string[]>([]);
    const [sprite, setSprite] = useState<string>('');
    const [ randomNumber, setRandomNumber] = useState(Math.floor(Math.random() * 1025));

    async function generateWord() {
        try {
            const { data } = await api.get(`pokemon/${randomNumber}`);
            let letters = data.name.split('');
            setBrokenWord(letters);
            setUnderlined(letters.map(() => '_'));
            setSprite(data.sprites.other["official-artwork"].front_default)
            
        } catch (error) {
            console.error(error)
        }

    }

    useEffect(() => {
        generateWord()
    }, []);

    useEffect(() => {
        const existe = underlined.filter(underlined => (underlined === "_")).length;
        
        if(existe <= 0){
            console.log("ganhou");
            setRandomNumber(Math.floor(Math.random() * 1025));
            generateWord();
        }
    },[underlined])


    return (
        <Container>
            <Header />
            <Content>
                <ImageTip>
                    <Rotom sprite={sprite} audio={`https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${randomNumber}.ogg`}/>
                </ImageTip>
                {/* <WordContent>
                    {underlined.map((letra: string, index: number) => (
                        <LetterSpace key={index}>
                            <Letters key={index}>{letra.toUpperCase()}</Letters>
                        </LetterSpace>
                    ))}
                </WordContent> */}
                <SendContent>
                    <Input id="inputLetra" type="text" />
                    <ButtonSend underlined={underlined} setUnderlined={setUnderlined} brokenWord={brokenWord} />
                </SendContent>
            </Content>
            <Footer />
        </Container>
    );
}