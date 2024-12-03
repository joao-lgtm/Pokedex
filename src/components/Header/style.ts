import styled from "styled-components";

export const Container = styled.header`
    grid-area: header;

    display: flex;
    justify-content: space-between;
    align-items: center;

    border-bottom: 1px solid ${({ theme }) => theme.font};
    box-shadow: 0px 14px 2px 1px ${({ theme }) => theme.boxshadow};

    /* margin-bottom: 15px; */
    padding: 0px 20px;
`;

export const Logo = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
    
    h1 {
            font-family: 'Pokemon Solid', sans-serif;
            font-size: 24px;
            color: yellow;
            -webkit-text-stroke-width: 1px;
            -webkit-text-stroke-color: #0000fbb3;
            letter-spacing: .1rem;
            cursor: pointer;
    }
`;


export const List = styled.ul`
    display: flex;
    list-style: none;
`;

export const Li = styled.li`
    padding: 25px;

    
    > span{ 
        background-image: linear-gradient(${({ theme }) => theme.font}, ${({ theme }) => theme.font});
        background-repeat: no-repeat;
        background-size: 0% 3px;
        background-position: left bottom;
        padding: 5px;
    } 

    &:hover{
        cursor: pointer;
        background-color: ${({ theme }) => theme.boxshadow};

        > span {
            background-size: 100% 3px;
            transition: background-size 0.2s ease-out;
        }
    }  
` ;


