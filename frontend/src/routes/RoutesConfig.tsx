import { Route, Routes, Navigate } from "react-router-dom";
import { AuthRoutesProps } from "../types/types";
import Layout from "../layout/Layout";
import Welcome from "../pages/welcome/Welcome";
import Login from "../pages/login/Login";
import Profile from "../pages/profile/Profile";
import Register from "../pages/register/Register";
import BasicDashboard from "../pages/dashboard/basic/BasicDashboard";
import Companies from "../pages/companies/Companies";
import UnauthorizedView from "../views/UnauthorizedView";
import UnauthLayout from "../layout/UnauthLayout";
import Home from "../pages/home/Home";
import CompanyDashboard from "../pages/dashboard/company/CompanyDashboard";
import SystemDashboard from "../pages/dashboard/system/SystemDashboard";
import ServerNotRunningView from "../views/ServerNotRunningView";
import Company from "../pages/company/Company";
import CreateScheduleUser from "../pages/createScheduleUser/CreateScheduleUser";
import BasicUser from "../pages/user/basic/BasicUser";
import CompanyUser from "../pages/user/company/CompanyUser";
import SystemUser from "../pages/user/system/SystemUser";

const AuthRoutes = (props: AuthRoutesProps) => {
    const { role } = props;

    return (
        <Routes>
            {role === "USER" && (
                <>
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                    <Route path="/dashboard" element={<Layout><BasicDashboard /></Layout>} />
                    <Route path="/companies" element={<Layout><Companies /></Layout>} />
                    <Route path={`/company/:id`} element={<Layout><Company /></Layout>}/>
                    <Route path={`/company/:id/equipment-set/:eqId`} element={<Layout><CreateScheduleUser /></Layout>}/>
                    <Route path="/user" element={<Layout><BasicUser /></Layout>} />
                    <Route path="/profile" element={<Layout><Profile /></Layout>} />
                    <Route path="/unauthorized" element={<Layout><UnauthorizedView /></Layout>} />
                    <Route path="*" element={<Navigate to="/" />} />
                </>
            )}

            {role === "COMPANY_ADMIN" && (
                <>
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                    <Route path="/dashboard" element={<Layout><CompanyDashboard /></Layout>} />
                    <Route path="/user" element={<Layout><CompanyUser /></Layout>} />
                    <Route path="/profile" element={<Layout><Profile /></Layout>} />
                    <Route path="/unauthorized" element={<Layout><UnauthorizedView /></Layout>} />
                    <Route path="*" element={<Navigate to="/" />} />
                </>
            )}

            {role === "SYSTEM_ADMIN" && (
                <>
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                    <Route path="/dashboard" element={<Layout><SystemDashboard /></Layout>} />
                    <Route path="/companies" element={<Layout><Companies /></Layout>} />
                    <Route path="/user" element={<Layout><SystemUser /></Layout>} />
                    <Route path="/profile" element={<Layout><Profile /></Layout>} />
                    <Route path="/unauthorized" element={<Layout><UnauthorizedView /></Layout>} />
                    <Route path="*" element={<Navigate to="/" />} />
                </>
            )}
        </Routes>
    );
};


const UnauthRoutes = () => (
    <Routes>
        <Route path="/" element={<UnauthLayout><Welcome /></UnauthLayout>} />
        <Route path="/home" element={<UnauthLayout><Home /></UnauthLayout>} />
        <Route path="/login" element={<UnauthLayout><Login /></UnauthLayout>} />
        <Route path="/register" element={<UnauthLayout><Register /></UnauthLayout>} />
        <Route path="/unauthorized" element={<UnauthLayout><UnauthorizedView /></UnauthLayout>} />
        <Route path="/service-unavailable" element={<UnauthLayout><ServerNotRunningView /></UnauthLayout>} />
        <Route path="*" element={<Navigate to="/" />} />
    </Routes>
);

export { AuthRoutes, UnauthRoutes };
