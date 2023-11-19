import { Route, Routes, Navigate } from "react-router-dom";
import Welcome from "../pages/welcome/Welcome";
import Login from "../pages/login/Login";
import Profile from "../pages/profile/Profile";
import Register from "../pages/register/Register";
import Dashboard from "../pages/dashboard/Dashboard";
import Layout from "../layout/Layout";
import Companies from "../pages/companies/Companies";
import UnauthorizedView from "../views/UnauthorizedView";
import UnauthLayout from "../layout/UnauthLayout";
import Home from "../pages/home/Home";

const AuthRoutes = () => (
    <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
        <Route path="/companies" element={<Layout><Companies /></Layout>} />
        <Route path="/profile" element={<Layout><Profile /></Layout>} />
        <Route path="/unauthorized" element={<Layout><UnauthorizedView /></Layout>} />
        <Route path="*" element={<Navigate to="/" />} />
    </Routes>
);

const UnauthRoutes = () => (
    <Routes>
        <Route path="/" element={<UnauthLayout><Welcome /></UnauthLayout>} />
        <Route path="/home" element={<UnauthLayout><Home /></UnauthLayout>} />
        <Route path="/login" element={<UnauthLayout><Login /></UnauthLayout>} />
        <Route path="/register" element={<UnauthLayout><Register /></UnauthLayout>} />
        <Route path="/unauthorized" element={<UnauthLayout><UnauthorizedView /></UnauthLayout>} />
        <Route path="*" element={<Navigate to="/" />} />
    </Routes>
);

export { AuthRoutes, UnauthRoutes };
