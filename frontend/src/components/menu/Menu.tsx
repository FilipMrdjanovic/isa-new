import { Link } from "react-router-dom";
import "./Menu.scss";

const Menu = () => {

    const menu = [
        {
            id: 1,
            title: "",
            listItems: [
                {
                    id: 1,
                    title: "Companies",
                    url: "/companies",
                    icon: "product.svg",

                },
                // {
                //     id: 2,
                //     title: "Users",
                //     url: "/users",
                //     icon: "user.svg",
                // },
                // {
                //     id: 3,
                //     title: "Orders",
                //     url: "/",
                //     icon: "order.svg",
                // },
            ],
        },
    ]


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
