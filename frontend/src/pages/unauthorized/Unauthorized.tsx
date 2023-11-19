import { ThemeProvider } from "styled-components";
import theme from "../../theme/theme";
import UnauthorizedView from "../../views/UnauthorizedView";

const Unauthorized = () => {
    return (
        <ThemeProvider theme={theme}>
            <div className="full-height-wrapper">
                <UnauthorizedView />
            </div>
        </ThemeProvider>
    );
};

export default Unauthorized;
