import { Container, Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import theme from "../../theme/theme";

const Welcome = () => {
  return (
    <ThemeProvider theme={theme}>
      <div className="full-height-wrapper">
        <Container component="main" maxWidth="xs" className="_container">
          <Box className="box" textAlign="center">
            <Typography component="h5">
              WELCOME TO
              </Typography>
            <Typography component="h1" variant="h5">
              <img src="/logo.svg" alt="" style={{ marginRight: "10px", verticalAlign: "sub"}} />
              EQUICENTRE
            </Typography>
            <Box sx={{marginTop: "10px", width: "300px", textDecoration: "underline"}} fontFamily="sans-serif">
              <Link to="/login" style={{ margin: '0px 40px' }}>
                Login
              </Link>
              <Link to="/register" style={{ margin: '0px 40px' }}>
                Register
              </Link>
            </Box>
          </Box>
        </Container>
      </div>
    </ThemeProvider>
  );
};

export default Welcome;
