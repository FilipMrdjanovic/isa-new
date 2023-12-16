import { ThemeProvider } from 'styled-components';
import { ToastContainer } from "react-toastify";
import RouteHandler from './routes/RouteHandler';
import "react-toastify/dist/ReactToastify.css";
import './styles/global.scss';
import { AuthProvider } from './api/auth/AuthContext';
import theme from './theme/theme';

function App() {

    return (
        <ThemeProvider theme={theme}>
            <AuthProvider>
                <ToastContainer />
                <RouteHandler/>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
