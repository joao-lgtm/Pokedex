import styled from "styled-components";


export const Container = styled.div`
    position: fixed;
    bottom: 10px;
    right: 5px;
    display: flex;
    flex-direction: column;
    gap: 5px;
`;

export const Circle = styled.div`
    width: 50px;
    height: 50px;

`;


export const Button = styled.button`
    width: 100%;
    height: 100%;
    border-radius: 100%;
    cursor: pointer;
    border-style: none;

    background-color: ${({ theme }) => theme.font};


    &:active{
        opacity: 0.5;
    }
`;
