import { createTheme } from '@mui/material/styles';
declare module '@mui/material/styles' {
    interface Palette {
        teal: Palette['primary'];
    }

    interface PaletteOptions {
        teal?: PaletteOptions['primary'];
    }
}

declare module '@mui/material/Button' {
    interface ButtonPropsColorOverrides {
        teal: true;
    }
}

let theme = createTheme({
    // Theme customization goes here as usual, including tonalOffset and/or
    // contrastThreshold as the augmentColor() function relies on these
});

theme = createTheme(theme, {
    palette: {
        teal: theme.palette.augmentColor({
            color: {
                main: '#081c15',
                // light: '#52b788',
                // dark: '#2d6a4f',
                // contrastText: '#d8f3dc',
            },
            name: 'teal',
        }),
    },
});

export default theme;