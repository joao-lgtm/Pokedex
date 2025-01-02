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
    flex-direction: column;
    flex-wrap: wrap;

    margin-top: 25px;
    /* overflow-y: scroll; */

`;

export const PokemonContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
`;

export const Search = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    margin-left: 25px;
    width: 97%;

`;