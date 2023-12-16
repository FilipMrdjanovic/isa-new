import { ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { Container, Box, Typography, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import theme from '../../theme/theme';
import useLogin from './useLogin';

const Login = () => {
    
    const { formData, handleChange, login } = useLogin();
    const handleSubmit = async (event: any) => {
        event.preventDefault();
        await login();
    };

    return (
        <ThemeProvider theme={theme}>
            <div className='full-height-wrapper'>
                <Container
                    component="main"
                    maxWidth="xs"
                    className="_container"
                >
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
                            <input
                                className="styledInput"
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Email Address"
                            />

                            <input
                                className="styledInput"
                                type="password"
                                name="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Password"
                            />

                            <Button
                                className="button"
                                type='submit'
                                variant="contained"
                                sx={{ margin: "10px 0" }}
                            >
                                Submit
                            </Button>
                            <Grid container>
                                <Grid item>
                                    <Link to="/register">
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
};

export default Login;
