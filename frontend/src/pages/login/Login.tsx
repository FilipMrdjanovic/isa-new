import { ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { Container, Box, Typography, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import { StyledTextInput } from '../../components/common/common';
import theme from '../../theme/theme';
import './Login.scss'

const Login = () => {

    const handleSubmit = (event: any) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        console.log({
            email: data.get('email'),
            password: data.get('password'),
        });
    };
    return (
        <ThemeProvider theme={theme}>
            <div className='full-height-wrapper'>

                <Container
                    component="main"
                    maxWidth="xs"
                    className="login-container">
                    <Box className="box">
                        <Typography component="h1" variant="h5">
                            Sign in
                        </Typography>
                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                            noValidate
                            sx={{ mt: 1 }}
                            className='form'
                        >
                            <StyledTextInput required autoComplete="email" autoFocus placeholder="Email Address" />
                            <StyledTextInput required autoComplete="password" autoFocus type='password' placeholder="Password" />
                            <Button className="button" type='submit' variant="contained" color="teal" sx={{ margin: "10px 0" }} >
                                Submit
                            </Button>
                            <Grid container>
                                <Grid item>
                                    <Link to="/">
                                        <Typography variant='body2'>Don't have an account? Sign Up</Typography>
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Container>
            </div>
        </ThemeProvider>
    );
}
export default Login;