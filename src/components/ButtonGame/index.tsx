export function ButtonSend({ palavraSub, setPalavraSub, palavraQuebrada }) {
    function send() {
        const valorInput = document.getElementById('inputLetra').value;
        let letra = valorInput[0];

        let novaPalavraSub = [...palavraSub];

        for (let i = 0; i < palavraQuebrada.length; i++) {
            if (letra === palavraQuebrada[i]) {
                novaPalavraSub[i] = letra;
            }
        }

        setPalavraSub(novaPalavraSub);
    }

    return (
        <>
            <button onClick={send}>enviar</button>
        </>
    )

}