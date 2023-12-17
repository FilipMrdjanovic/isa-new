import { Outlet } from "react-router-dom";
import MuiNavbarUnauth from "../components/navbar/mui/MuiNavbarUnauth";
import { Box, CssBaseline } from "@mui/material";
import { ThemeProvider } from "styled-components";
import theme from "../theme/theme";

type UnauthLayoutProps = {
    children: React.ReactNode;
};

const UnauthLayout = (props: UnauthLayoutProps) => { // Fix the parameter here
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <MuiNavbarUnauth />
            <Box>
                <Outlet />
                    {props.children}
            </Box>
        </ThemeProvider>
    );
};
export default UnauthLayout;
