import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import Menu from "../components/menu/Menu";

type LayoutProps = {
    children: React.ReactNode;
  };

const Layout = (props: LayoutProps) => { // Fix the parameter here
    return (
        <div className="main">
            <Navbar />
            <div className="container">
                <div className="menuContainer">
                    <Menu />
                </div>
                <div className="contentContainer">
                    <Outlet />
                    {props.children}
                </div>
            </div>
        </div>
    );
};
export default Layout;
