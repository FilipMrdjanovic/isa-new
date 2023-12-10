import React, { useEffect } from "react";
import { NavLink } from 'react-router-dom'
import { useState } from "react";
import { MenuItem, Divider } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Logout from "@mui/icons-material/Logout";
import { StyledMenu } from "../common/common";
import { useAuth } from "../../api/auth/AuthContext";
import "./navbar.scss";
import axiosInstance from "../../api/axios";

const Navbar = () => {
    const {logout} = useAuth()
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const [name, setName] = useState("User")

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleProfile = () => {
        handleClose()
    }

    const handleLogout = () => {
        handleClose(); // Close the menu after logout
        logout()
    };

    useEffect(() => {
        const getName = () => {
            axiosInstance.get("/user/me").then((response: any) => {
                setName(response.data.user.firstname);
            });
        };
        getName();
    }, []);
    
    return (
        <div className="navbar">
            <NavLink to="/">
                <div className="logo">
                    <img src="logo.svg" alt="" />
                    <span>EQUICENTRE</span>
                </div>
            </NavLink>
            <div className="icons" onClick={handleClick}>
                <div className="user">
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
                        alt=""
                    />
                    <span>{name}</span>
                </div>
            </div>
            <StyledMenu
                MenuListProps={{
                    'aria-labelledby': 'demo-customized-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <NavLink to="/profile">
                    <MenuItem onClick={handleProfile} disableRipple>
                        <AccountCircleIcon />
                        Profile
                    </MenuItem>
                </NavLink>
                <Divider sx={{ my: 0.5 }} />

                <NavLink to="/login">
                    <MenuItem onClick={handleLogout} disableRipple>
                        <Logout />
                        Logout
                    </MenuItem>
                </NavLink>
            </StyledMenu>
        </div>
    );
};

export default Navbar;
