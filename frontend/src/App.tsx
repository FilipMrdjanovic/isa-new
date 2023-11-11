import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import theme from './theme/theme';
import './styles/global.scss';
import router from './routes/RouteHandler';

function App() {

    return (
        <ThemeProvider theme={theme}>
            <RouterProvider router={router} />
        </ThemeProvider>
    );
}

export default App;
