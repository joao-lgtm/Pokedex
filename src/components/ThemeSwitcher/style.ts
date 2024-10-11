import styled from "styled-components";

export const Container = styled.div`
    border: 1px solid red;
    border-radius: 10px;

    width: 60px;
    height: 25px;
    
    display: flex;
    align-items: center;
`;


export const Button = styled.button`
    border: 1px solid blue;
    border-radius: 10px;
    
    background: white;
    width: 20px;
    height: 20px;

    transform: translateX(0px);
    transition: transform 0.5s ease-in-out;

    cursor: pointer;

    &[data-theme="false"]{
        transform: translateX(37px);
        transition: transform 0.5s ease-in-out;
    }
`;