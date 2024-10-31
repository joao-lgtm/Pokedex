import styled from "styled-components";

export const Container = styled.div`
    width: 100%;
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

    display: grid;
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows:  350px;
`;
