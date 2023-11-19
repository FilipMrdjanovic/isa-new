import { NavLink } from 'react-router-dom'
import "./navbar.scss";
import './unauth.scss'

const UnauthNavbar = () => {

    return (
        <div className="navbar">
            <NavLink to="/">
                <div className="logo">
                    <img src="logo.svg" alt="" />
                    <span>EQUICENTRE</span>
                </div>
            </NavLink>
            <div className="unauth">
                <NavLink to="/home">
                    <div className="user">
                        <span>Home</span>
                    </div>
                </NavLink>
                <NavLink to="/login">
                    <div className="user">
                        <span>Login</span>
                    </div>
                </NavLink>
                <NavLink to="/register">
                    <div className="user">
                        <span>Register</span>
                    </div>
                </NavLink>
            </div>
        </div>
    );
};

export default UnauthNavbar;
