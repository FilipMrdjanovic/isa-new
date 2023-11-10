import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import Menu from "../components/menu/Menu";

const Layout = () => {
    return (
        <div className="main">
            <Navbar />
            <div className="container">
                <div className="menuContainer">
                    <Menu />
                </div>
                <div className="contentContainer">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};
export default Layout;