import styled from "styled-components";

export const Container = styled.div`
    height: 100vh;

    display: grid;
    grid-template-columns: 100%;
    grid-template-rows: auto 1fr auto;
    grid-template-areas: 
    "header"
    "content"
    "footer";
`;



export const Content = styled.div`
    grid-area: content;
    
    padding: 20px;

    display: flex;
    flex-direction: column;
    gap: 15px;
    justify-content: space-around;
`;


export const ImageTip = styled.div`
    display: flex;
    justify-content: center;

    > #esterno {
        border: 1px solid #ff000082;
        border-radius: 15px;
        
        width: 800px;
        height: 600px;

        display: flex;
        justify-content: center;
        align-items: center;
        
        background-color: #DC0A2D;

        > #interno {
            width: 500px;
            height: 400px;
            position: relative;
            
            border: 50px solid #DEDEDE;
            border-bottom-left-radius: 75px;
            border-bottom-right-radius: 5px;
            border-top-right-radius: 5px;
            border-top-Left-radius: 5px;
            

            background-color: white;

            > #dentro {
                display: flex;
                justify-content: center;
                align-items: center;

                border: 3px solid black;
                border-radius: 5px;

                width: 100%;
                height: 100%;

                > img{
                    filter: brightness(0%);
                    pointer-events: none;
                    user-select: none;
                    
                }
            }

            
        }        
    }
`;


export const WordContent = styled.div`
    display: flex;
    justify-content: center;
    gap: 15px;
    
`;

export const LetterSpace = styled.div`
    border: 1px solid ${({ theme }) => theme.font};  
    border-radius: 15px;
    padding: 25px 20px 5px 20px;
`;

export const Letters = styled.div`  
    font-size: 2rem;
    margin: 20px;
`;


export const SendContent = styled.div`
    display: flex;
    gap: 10px;
    height: 50px;
`;