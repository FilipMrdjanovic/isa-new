import "./navbar.scss";

const Navbar = () => {
    return (
        <div className="navbar">
            <div className="logo">
                <img src="logo.svg" alt="" />
                <span>EQUICENTRE</span>
            </div>
            <div className="icons">
                <div className="user">
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
                        alt=""
                    />
                    <span>Admin</span>
                </div>
                <img src="/settings.svg" alt="" className="icon" />
            </div>
        </div>
    );
};

export default Navbar;
