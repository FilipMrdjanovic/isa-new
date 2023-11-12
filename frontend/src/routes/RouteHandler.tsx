import { createBrowserRouter } from "react-router-dom";
import Layout from "../layout/Layout";
import Companies from "../pages/companies/Companies";
import Home from "../pages/home/Home";
import Login from "../pages/login/Login";
import User from "../pages/user/User";
import Register from "../pages/register/Register";

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            {
                path: '/',
                element: <Home />,
            },
            {
                path: '/users',
                element: <User />,
            },
            {
                path: '/companies',
                element: <Companies />,
            },
            {
                path: '/users/:id',
                element: <User />,
            },
            {
                path: '/companies/:id',
                element: <Companies />,
            },
        ],
    },
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/register',
        element: <Register />,
    },
]);

export default router;