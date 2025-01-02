import styled from "styled-components";

export const Container = styled.div <{ $color?: string }>`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    margin: 15px;
    background-color: ${props => props.$color};
    padding: 25px;
    width: 330px;
    height: 230px;

    box-shadow: 12px 12px 2px 1px ${({ theme }) => theme.boxshadow};


    border: 1px ${({ theme }) => theme.font} solid;
    border-radius: 15px;

   
`;

export const Id = styled.div <{ $colorText?: string }>`
    position: absolute;
    right: 3%;
    top: 3%;

    color: ${props => props.$colorText === "black" ? "#fff" : "#000"};
`;

export const Name = styled.div <{ $colorName?: string }>`
    margin-top: 15px;
    h2 {
        font-size: 1.2rem;
        
    }

`;

export const ImgAndTypes = styled.div`
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
    
    width: 100%;

    > img{
        width: 150px;
        cursor: pointer;
        z-index: 15;
    }
`;




export const Types = styled.div`
    display: flex;
    flex-direction: column;
    height: fit-content;
    gap: 15px;     
    width: 95px;

    > span {
        text-align: center;
    }
`;

export const Type = styled.span<{ $types?: string }>`
    background-color: ${props => props.$types};

    color: #fff;

    padding: 5px 15px;
    border-radius: 15px;
    border-style: double;
    border-width: 5px;
    border-color: white;
`;
