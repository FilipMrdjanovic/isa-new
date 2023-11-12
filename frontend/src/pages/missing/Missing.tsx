import { Container, Box, Typography } from "@mui/material";
import { ThemeProvider } from "styled-components";
import theme from "../../theme/theme";

const Missing = () => {
  return (
    <ThemeProvider theme={theme}>
      <div className="full-height-wrapper">
        <Container component="main" maxWidth="xs" className="_container">
          <Box className="box" textAlign="center">
            <Typography component="h5">
              Missing
              </Typography>
              <Typography component="h1">
                404
              </Typography>
          </Box>
        </Container>
      </div>
    </ThemeProvider>
  );
};

export default Missing;
