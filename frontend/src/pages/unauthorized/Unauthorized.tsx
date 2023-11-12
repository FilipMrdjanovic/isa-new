import { Container, Box, Typography } from "@mui/material";
import { ThemeProvider } from "styled-components";
import theme from "../../theme/theme";

const Unauthorized = () => {
  return (
    <ThemeProvider theme={theme}>
      <div className="full-height-wrapper">
        <Container component="main" maxWidth="xs" className="_container">
          <Box className="box" textAlign="center">
            <Typography component="h5">
              UNAUTHORIZED
              </Typography>
          </Box>
        </Container>
      </div>
    </ThemeProvider>
  );
};

export default Unauthorized;
