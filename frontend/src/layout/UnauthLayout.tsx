import { Outlet } from "react-router-dom";
import UnauthNavbar from "../components/navbar/UnauthNavbar";

type UnauthLayoutProps = {
    children: React.ReactNode;
  };

const UnauthLayout = (props: UnauthLayoutProps) => { // Fix the parameter here
    return (
        <div className="main">
            <UnauthNavbar />
            <div className="container">
                <div className="contentContainer">
                    <Outlet />
                    {props.children}
                </div>
            </div>
        </div>
    );
};
export default UnauthLayout;
