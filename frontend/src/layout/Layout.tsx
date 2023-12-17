import React from "react";
import { Outlet } from "react-router-dom";
import { ThemeProvider } from 'styled-components';
import { Box, Card, CssBaseline, Toolbar } from "@mui/material";
import MuiNavbar from "../components/navbar/mui/MuiNavbar";
import MuiMenu from "../components/menu/mui/MuiMenu";
import theme from "../theme/theme";


type LayoutProps = {
    children: React.ReactNode;
};

const drawerWidth = 240;

const Layout = (props: LayoutProps) => {

    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };


    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <MuiNavbar drawerWidth={drawerWidth} handleDrawerToggle={handleDrawerToggle} />
                <MuiMenu drawerWidth={drawerWidth} mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
                <Box
                    component="main"
                    className="contentContainer"
                    sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
                >
                    <Toolbar />
                    <Outlet />
                    <Card sx={{minHeight: "calc(100vh - 64px - 48px)"}}>
                        {props.children}
                    </Card>
                </Box>
            </Box>
        </ThemeProvider>
    );
};
export default Layout;
