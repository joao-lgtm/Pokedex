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
    
    padding: 10px 20px;

    display: flex;
`;