import styled from "styled-components";

// Replace these with your CSS variable names from your theme
const mainColor = 'var(--main-color)';
const softColor = 'var(--soft-color)';

export const ParentContainerStyles = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: 0 auto;
  border-radius: 20px;
  overflow-y: scroll;
  background-color: ${mainColor}; /* Use CSS variable */
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
  background-color: ${softColor}; /* Use CSS variable */
`;

export const LowerRowContainerStyles = styled.div`
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
  user-select: none;
  border-radius: 20px;
  background-color: ${softColor}; /* Use CSS variable */
`;

export const VerticalLine = styled.div`
  height: 100%;
  width: 1px;
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
