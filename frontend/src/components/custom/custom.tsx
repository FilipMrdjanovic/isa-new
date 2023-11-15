import styled from "styled-components";

export const ParentContainerStyles = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: 0 auto;
  background-color: white;
  border-radius: 20px;
  overflow-y: scroll;

`;

export const UpperRowStyles = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
`;

export const ColumnStyles = styled.div`
  flex: 1;
  padding: 20px;
`;

export const CenteredRowStyles = styled.div`
  text-align: center;
  width: 100%;
`;

export const CenteredColumnStyles = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border: 1px solid #ccc;
`;

export const LowerRowContainerStyles = styled.div`
  border-bottom: 1px solid black;
  width: 100%;
  margin-top: 8px;
`;

export const LowerRowStyles = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
`;

export const LowerColumnStyles = styled.div`
  flex: 1;
  padding: 20px;
  max-width: 500px;
  margin: 10px;
  text-align: center;
  user-select: none; /* Add this line to make the text non-selectable */
  border-radius: 20px;
  border: 3px solid rgba(0,0,0,0.2);
`;

export const VerticalLine = styled.div`
  height: 100%;
  width: 1px;
  background-color: gray;
  margin: 0 20px;
`;

export const Header = styled.header`
  text-align: center;
`;

export const Main = styled.main`
  display: flex;
  flex-direction: column;
  & .MuiTextField-root {
    margin-bottom: 1rem;
    width: 300px;
  }
`;

export const Footer = styled.footer`
  margin-top: 8px;
  width: 300px;
`;