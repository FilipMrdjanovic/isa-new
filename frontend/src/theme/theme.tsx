import { createTheme } from "@mui/material";
import { amber, teal, grey } from "@mui/material/colors";

const customTheme = createTheme({
    palette: {
        primary: {
            main: teal[500], // #009688
            contrastText: "#FFFFFF", // Text color against primary
        },
        secondary: {
            main: amber[700], // #FF9800
            contrastText: "#212121", // Text color against secondary
        },
        background: {
            default: grey[900], // #212121
            paper: "#00695c",
        },
        text: {
            primary: "#FFFFFF", // Default text color
            secondary: "#FFFFFF", // Secondary text color
        },
    },
});

// Type casting to resolve TypeScript errors
const theme = customTheme as any;

// Add the custom property directly to the theme object
theme.palette.background.secondaryPaper = "#00695c";

export default theme;
