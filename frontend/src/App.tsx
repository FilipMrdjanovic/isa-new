import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { ToastContainer } from "react-toastify";
import theme from './theme/theme';
import router from './routes/RouteHandler';
import "react-toastify/dist/ReactToastify.css";
import './styles/global.scss';

function App() {

    return (
        <ThemeProvider theme={theme}>
            <ToastContainer />
            <RouterProvider router={router} />
        </ThemeProvider>
    );
}

export default App;
