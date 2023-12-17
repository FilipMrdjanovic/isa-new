import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { NavLink } from 'react-router-dom';
import theme from '../../../theme/theme';

const MuiNavbarUnauth = () => {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static"
                sx={{ background: theme.palette.primary.main }}>
                <Toolbar>
                    <NavLink to="/">
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <IconButton
                                size="large"
                                edge="start"
                                color="inherit"
                                aria-label="open drawer"
                                sx={{ mr: 2 }}
                            >
                                <img src="/logo.svg" alt="" />
                            </IconButton>
                            <Typography
                                variant="h6"
                                noWrap
                                component="div"
                                sx={{ display: { xs: 'none', sm: 'block' } }}
                            >
                                EQUICENTRE
                            </Typography>
                        </Box>
                    </NavLink>
                    <Box sx={{ display: { xs: 'none', md: 'flex', margin: "0 10px" } }}>
                        <NavLink to="/home">
                            <Typography
                                variant="h6"
                                noWrap
                                component="div"
                                sx={{ display: { xs: 'none', sm: 'block', margin: "0 10px" } }}
                            >
                                HOME
                            </Typography>
                        </NavLink>
                        <NavLink to="/login">
                            <Typography
                                variant="h6"
                                noWrap
                                component="div"
                                sx={{ display: { xs: 'none', sm: 'block', margin: "0 10px" } }}
                            >
                                LOGIN
                            </Typography>
                        </NavLink>
                        <NavLink to="/register">
                            <Typography
                                variant="h6"
                                noWrap
                                component="div"
                                sx={{ display: { xs: 'none', sm: 'block', margin: "0 10px" } }}
                            >
                                REGISTER
                            </Typography>
                        </NavLink>
                    </Box>

                </Toolbar>
            </AppBar>
        </Box>
    );
}
export default MuiNavbarUnauth;