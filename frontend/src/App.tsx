import { ToastContainer } from "react-toastify";
import RouteHandler from './routes/RouteHandler';
import "react-toastify/dist/ReactToastify.css";
import './styles/global.scss';
import { AuthProvider } from './api/auth/AuthContext';

function App() {

    return (
        <AuthProvider>
            <ToastContainer />
            <RouteHandler />
        </AuthProvider>
    );
}

export default App;
