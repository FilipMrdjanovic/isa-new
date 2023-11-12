import { ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';
import { Container, Box, Typography, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import useRegister from './useRegister';
import theme from '../../theme/theme';
import './Register.scss';

const Register = () => {
    const { formData, handleChange, register } = useRegister();

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        await register();
    };

    return (
        <ThemeProvider theme={theme}>
            <div className='full-height-wrapper'>
                <Container
                    component="main"
                    maxWidth="xs"
                    className="register-container"
                >
                    <Box className="box">
                        <Typography component="h1" variant="h5">
                            Sign up
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
                            <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                                <Grid item xs={6}>
                                    <input
                                        className="styledInput"
                                        type="password"
                                        name="password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Password"
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <input
                                        className="styledInput"
                                        type="password"
                                        name="confirm_password"
                                        required
                                        value={formData.confirm_password}
                                        onChange={handleChange}
                                        placeholder="Confirm Password"
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <input
                                        className="styledInput"
                                        type="text"
                                        name="firstname"
                                        required
                                        value={formData.firstname}
                                        onChange={handleChange}
                                        placeholder="First name"
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <input
                                        className="styledInput"
                                        type="text"
                                        name="lastname"
                                        required
                                        value={formData.lastname}
                                        onChange={handleChange}
                                        placeholder="Last name"
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <input
                                        className="styledInput"
                                        type="text"
                                        name="city"
                                        required
                                        value={formData.city}
                                        onChange={handleChange}
                                        placeholder="City"
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <input
                                        className="styledInput"
                                        type="text"
                                        name="country"
                                        required
                                        value={formData.country}
                                        onChange={handleChange}
                                        placeholder="Country"
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <input
                                        className="styledInput"
                                        type="text"
                                        name="occupation"
                                        required
                                        value={formData.occupation}
                                        onChange={handleChange}
                                        placeholder="Occupation"
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <input
                                        className="styledInput"
                                        type="text"
                                        name="organization"
                                        required
                                        value={formData.organization}
                                        onChange={handleChange}
                                        placeholder="Organization"
                                    />
                                </Grid>
                            </Grid>
                            <input
                                className="styledInput"
                                type="text"
                                name="phone"
                                required
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="Phone"
                            />
                            <Button
                                className="button"
                                type='submit'
                                variant="contained"
                                color="teal"
                                sx={{ margin: "10px 0" }}
                            >
                                Submit
                            </Button>
                            <Grid container>
                                <Grid item>
                                    <Link to="/login">
                                        <Typography variant='body2'>Already have an account? Sign In</Typography>
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

export default Register;
