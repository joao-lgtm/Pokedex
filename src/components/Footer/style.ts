import styled from "styled-components";

export const Container = styled.footer`
    grid-area: footer;
    padding: 20px;
    border-top: 1px solid ${({ theme }) => theme.font};
`;

export const Content = styled.div`
    display: flex;
    justify-content: center;

`;