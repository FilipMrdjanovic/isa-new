import { amber, teal } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
      primary: {
        main: "#40916c",
        mainColor: "white",
        tealDark: "#2d6a4f",
      },
      secondary: {
        main: amber[500],
      },
    },
    components: {
        MuiAppBar: {
          styleOverrides: {
            root: {
              background: teal[500],
            },
          },
        },
      },
  });
  
export default theme