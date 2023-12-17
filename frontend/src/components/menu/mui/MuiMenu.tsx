import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import { useAuth } from '../../../api/auth/AuthContext';
import { Link } from 'react-router-dom';
import theme from '../../../theme/theme';
import { colors } from '@mui/material';

interface Props {
    window?: () => Window;
    drawerWidth: number;
    mobileOpen: boolean;
    handleDrawerToggle: any;
}

const MuiMenu = (props: Props) => {
    const { auth } = useAuth()

    const { window } = props;

    const basicMenu = [
        {
            id: 1,
            title: "Companies",
            url: "/companies",
            icon: "/product.svg",

        },
        {
            id: 2,
            title: "User",
            url: "/user",
            icon: "/user.svg",
        },
        {
            id: 3,
            title: "Schedule",
            url: "/schedule",
            icon: "/profile.svg",
        }
    ]
    const companyMenu = [

        {
            id: 1,
            title: "User",
            url: "/user",
            icon: "/user.svg",
        },
    ]
    const systemMenu = [
        {
            id: 1,
            title: "Companies",
            url: "/companies",
            icon: "/product.svg",

        },
        {
            id: 2,
            title: "User",
            url: "/user",
            icon: "/user.svg",
        },
    ]
    let menu = basicMenu;
    if (auth.role === "COMPANY_ADMIN") {
        menu = companyMenu;
    } else if (auth.role === "SYSTEM_ADMIN") {
        menu = systemMenu;
    }

    const drawer = (
        <Box>
            <Toolbar />
            {/* <Divider /> */}
            <List>
                {menu.map((item) => (
                    <ListItem key={item.id} disablePadding component={Link} to={item.url}>
                        {/* <Link to={item.url}> */}
                        <ListItemButton>
                            <ListItemIcon>
                                <img src={item.icon} alt={item.title} />
                            </ListItemIcon>
                            <ListItemText primary={item.title} sx={{color: theme.palette.primary.mainColor}}/>
                        </ListItemButton>
                        {/* </Link> */}
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    // Remove this const when copying and pasting into your project.
    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <Box
            component="nav"
            sx={{
                width: { sm: props.drawerWidth },
                flexShrink: { sm: 0 },
            }}
        >
            <Drawer
                container={container}
                variant="temporary"
                open={props.mobileOpen}
                onClose={props.handleDrawerToggle}
                ModalProps={{
                    keepMounted: true, // Better open performance on mobile.
                }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: props.drawerWidth,
                        backgroundColor: theme.palette.primary.tealDark,
                    },

                }}
            >
                {drawer}
            </Drawer>
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: props.drawerWidth,
                        backgroundColor: theme.palette.primary.tealDark,
                    },
                }}
                open
            >
                {drawer}
            </Drawer>
        </Box>
    );
}
export default MuiMenu;