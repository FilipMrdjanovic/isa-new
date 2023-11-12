import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Welcome from "../pages/welcome/Welcome";
import Login from "../pages/login/Login";
import Profile from "../pages/profile/Profile";
import { RequireAuth } from "../api/auth/RequireAuth";
import Missing from "../pages/missing/Missing";
import Register from "../pages/register/Register";
import Dashboard from "../pages/dashboard/Dashboard";
import { useAuth } from "../api/auth/AuthContext";

const RouteHandler = () => {
    const auth = useAuth()
    return (
        <Router>
            <Routes>
                <Route path='/' element={auth ? <Navigate to="/dashboard" /> : <Welcome />} />
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />

                <Route
                    path='/profile'
                    element={
                        <RequireAuth>
                            <Profile />
                        </RequireAuth>
                    }
                />
                <Route
                    path='/dashboard'
                    element={
                        <RequireAuth>
                            <Dashboard />
                        </RequireAuth>
                    }
                />
                <Route path='*' element={<Missing />} />
            </Routes>
        </Router>
    )
};

export default RouteHandler;


{/* <Route path='order-summary' element={<OrderSummary />} />
          <Route path='products' element={<Products />}>
            <Route index element={<FeaturedProducts />} />
            <Route path='featured' element={<FeaturedProducts />} />
            <Route path='new' element={<NewProducts />} />
          </Route>
          <Route path='users' element={<Users />}>
            <Route path=':userId' element={<UserDetails />} />
            <Route path='admin' element={<Admin />} />
          </Route> */}