import styled from "styled-components";

export const Container = styled.div`
    width: 100%;
`;

export const Input = styled.input`
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    width: 100%;

    &::placeholder{
        color:gray;
    }
`;