import { ThemeProvider } from "styled-components";
import theme from "../../theme/theme";
import ServerNotRunningView from "../../views/ServerNotRunningView";

const ServerNotRunning = () => {
    return (
        <ThemeProvider theme={theme}>
            <div className="full-height-wrapper">
                <ServerNotRunningView />
            </div>
        </ThemeProvider>
    );
};

export default ServerNotRunning;
