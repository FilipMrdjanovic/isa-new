import { Route, Routes, Navigate } from "react-router-dom";
import Welcome from "../pages/welcome/Welcome";
import Login from "../pages/login/Login";
import Profile from "../pages/profile/Profile";
import Register from "../pages/register/Register";
import Dashboard from "../pages/dashboard/Dashboard";
import Layout from "../layout/Layout";

const AuthRoutes = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/dashboard" />} />
    <Route path="/profile" element={<Layout><Profile /></Layout>} />
    <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
    <Route path="*" element={<Navigate to="/" />} />
  </Routes>
);

const UnauthRoutes = () => (
  <Routes>
    <Route path="/" element={<Welcome />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="*" element={<Navigate to="/" />} />
  </Routes>
);

export { AuthRoutes, UnauthRoutes };
