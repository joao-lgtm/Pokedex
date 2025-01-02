import styled from "styled-components";

export const Container = styled.button`
    border-style: none;
    border-radius: 5px;
    

    width: 100%;
    height: 100%;
    cursor: pointer;

    background-color: #e55e00;
    border: 1px solid black;
    color: white;

    &:active{
        opacity: 0.5;
    }
`;