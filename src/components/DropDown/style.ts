import styled from "styled-components";

export const Dropdown = styled.div`
  position: relative;
  border-radius: 0.25rem;
  width: 150px;
  border: 1px solid ${({ theme }) => theme.font};
`;

export const DropdownToggle = styled.div`
  padding: 0.625rem;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 0.25rem;
  width: 100%;

  .infos{
    display: flex; 
    align-items: center;
    gap: 0.5rem;
  }
`;

export const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  border: 1px solid black;
  border-radius: 0.25rem;
  max-height: 12.5rem;
  overflow-y: auto;
  z-index: 1000;
  color: ${({ theme }) => theme.font};
`;

export const DropdownItem = styled.div`
  padding: 0.625rem;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  cursor: pointer;
  background-color: ${({ theme }) => theme.background};

  &:hover {
    color: ${({ theme }) => theme.background};
    background-color: ${({ theme }) => theme.font};
  }
`;

export const Arrow = styled.span`
  border: solid gray;
  border-width: 0 2px 2px 0;
  display: inline-block;
  padding: 0.188rem;
  transform: rotate(45deg);
  margin-left: auto;
`;