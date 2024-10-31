import styled from "styled-components";

export const Container = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    margin: 15px;
    width: 250px;
    height: 318px;

    box-shadow: 12px 12px 2px 1px ${({ theme }) => theme.boxshadow};


    border: 1px ${({ theme }) => theme.font} solid;
    border-radius: 15px;

    > div {
        margin-top: 15px;
        width: 100%;
        display: flex;
        justify-content: center;

        > span{
            position: absolute;
            left: 10px;
            color: rgb(125,125,124);
         }

        h2 {
            font-size: 1.2rem;
        }
    }

    > img{
        width: 250px;
        cursor: pointer;
    }

  

`;