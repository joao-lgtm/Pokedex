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
    grid-template-columns: repeat(7, 1fr);
    grid-template-rows: repeat(22, 350px);

    
  
`;


export const Card = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    gap: 15px;
    margin: 15px;

    box-shadow: 12px 12px 2px 1px ${({ theme }) => theme.boxshadow};


    border: 1px ${({ theme }) => theme.font} solid;
    border-radius: 15px;

    > img{
        width: 100px;
        cursor: pointer;
    }

    > span{
        position: absolute;
        top: 10px;
        left: 10px;
        color: rgb(125,125,124);
    }

    h2 {
        font-size: 1.2rem;
    }
`;
