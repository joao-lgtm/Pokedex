import styled from "styled-components";

export const Container = styled.div`
    border: 1px solid red;
    border-radius: 10px;

    width: 70px;
    height: 30px;
    
    display: flex;
    align-items: center;
`;


export const Button = styled.button`
    border: none;
    background-color: transparent;
    border-radius: 10px;
    background-image: url(https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/337.png);
    background-position: center center;
    background-size: 30px;
    background-repeat: no-repeat;

    width: 30px;
    height: 30px;

    transform: translateX(0px);
    transition: transform 0.5s ease-in-out;

    

    cursor: pointer;

    &[data-theme="false"]{
        background-image: url(https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/338.png);

        transform: translateX(37px);
        transition: transform 0.5s ease-in-out;
    }
`;