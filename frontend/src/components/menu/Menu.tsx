import { Link } from "react-router-dom";
import { useAuth } from "../../api/auth/AuthContext";
import "./Menu.scss";

const Menu = () => {

    const {auth} = useAuth()

    const basicMenu = [
        {
            id: 1,
            title: "",
            listItems: [
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
            ],
        },
    ]
    const companyMenu = [
        {
            id: 1,
            title: "",
            listItems: [
                {
                    id: 1,
                    title: "User",
                    url: "/user",
                    icon: "/user.svg",
                },
            ],
        },
    ]
    const systemMenu = [
        {
            id: 1,
            title: "",
            listItems: [
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
            ],
        },
    ]
    let menu = basicMenu;
    if (auth.role === "COMPANY_ADMIN") {
        menu = companyMenu;
    } else if (auth.role === "SYSTEM_ADMIN") {
        menu = systemMenu;
    }

    return (
        <div className="menu">
            {menu.map((item) => (
                <div className="item" key={item.id}>
                    <span className="title">{item.title}</span>
                    {item.listItems.map((listItem) => (
                        <Link to={listItem.url} className="listItem" key={listItem.id}>
                            <img src={listItem.icon} alt="" />
                            <span className="listItemTitle">{listItem.title}</span>
                        </Link>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Menu;