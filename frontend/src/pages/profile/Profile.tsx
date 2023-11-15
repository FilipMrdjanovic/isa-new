import { useState, useEffect } from "react";
import { Grid, ThemeProvider } from "@mui/material";
import Button from '@mui/material/Button';
import { useAuth } from "../../api/auth/AuthContext";
import { getRankColor } from "../../helpers/rank";
import useUser from "../../hooks/useUser";
import './Profile.scss'
import theme from "../../theme/theme";

const Profile = () => {
    const { auth } = useAuth();
    const { userPassword, userData, userRank, handleChange, handleChangePassword, updateProfile, updatePassword } = useUser();

    const [rankCategory, setRankCategory] = useState("");
    const [background, setBackground] = useState("");

    useEffect(() => {
        setRankCategory(userRank.name);
        setBackground(getRankColor(userRank));
    }, [userRank]);

    useEffect(() => {
        setRankCategory(userRank.name);
    }, [userRank]);

    const handleUpdateProfile = async (event: any) => {
        event.preventDefault();
        await updateProfile();
    };

    const handleUpdatePassword = async (event: any) => {
        event.preventDefault();
        await updatePassword();
    };


    return (
        <ThemeProvider theme={theme}>
            <div className="content-wrapper">
                <section className="content-header">
                    <h1>Profile</h1>
                </section>

                <section className="content">
                    <div className="box box-primary">
                        <div className="box-body box-profile">
                            <img style={{ border: "5px solid", borderColor: background }} className="profile-user-img img-circle" src="https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png" alt="User profile picture" />
                            <h3 className="profile-username text-center">{userData.firstname} {userData.lastname}</h3>
                            <p className="text-muted text-center">{auth.role} - <span style={{ color: background }}>{rankCategory}</span> RANK</p>
                            <p className="text-muted text-center">{userData.occupation}</p>
                            <p className="text-muted text-center">{userData.city} - {userData.country}</p>
                            <p className="text-muted text-center">{userData.email}</p>
                            <p className="text-muted text-center">{userData.phone}</p>
                            <p className="text-muted text-center">
                                Penalty Points: {userData.penaltyPoints}</p>
                            <p className="text-muted text-center">
                                Loyalty Points: {userData.loyaltyPoints}
                            </p>
                        </div>
                    </div>
                </section>
            </div>
            <div className="content-wrapper _container">
                <div className="box box-primary">
                    <section className="content-header">
                        <h1>Profile Update</h1>
                    </section>
                    <form role="form" onSubmit={handleUpdateProfile}>
                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                            <Grid item xs={6}>
                                <input
                                    className="styledInput"
                                    type="text"
                                    name="firstname"
                                    required
                                    value={userData.firstname}
                                    onChange={handleChange}
                                    placeholder="First Name"
                                />
                            </Grid><Grid item xs={6}>
                                <input
                                    className="styledInput"
                                    type="text"
                                    name="lastname"
                                    required
                                    value={userData.lastname}
                                    onChange={handleChange}
                                    placeholder="Last Name"
                                />
                            </Grid><Grid item xs={6}>
                                <input
                                    className="styledInput"
                                    type="text"
                                    name="city"
                                    required
                                    value={userData.city}
                                    onChange={handleChange}
                                    placeholder="City"
                                />
                            </Grid><Grid item xs={6}>
                                <input
                                    className="styledInput"
                                    type="text"
                                    name="country"
                                    required
                                    value={userData.country}
                                    onChange={handleChange}
                                    placeholder="Country"
                                />
                            </Grid><Grid item xs={6}>
                                <input
                                    className="styledInput"
                                    type="tel"
                                    name="phone"
                                    required
                                    value={userData.phone}
                                    onChange={handleChange}
                                    placeholder="Phone"
                                />
                            </Grid><Grid item xs={6}>
                                <input
                                    className="styledInput"
                                    type="text"
                                    name="occupation"
                                    required
                                    value={userData.occupation}
                                    onChange={handleChange}
                                    placeholder="Occupation"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <input
                                    className="styledInput"
                                    type="text"
                                    name="organization"
                                    required
                                    value={userData.organization}
                                    onChange={handleChange}
                                    placeholder="Organization"
                                />
                            </Grid>
                        </Grid>
                        <Button
                            className="button"
                            type='submit'
                            variant="contained"
                            color="teal"
                            sx={{ margin: "10px 0" }}
                        >
                            Update
                        </Button>
                    </form>
                </div>
            </div>
            <div className="content-wrapper _container">
                <div className="box box-primary">
                    <section className="content-header">
                        <h1>Password Update</h1>
                    </section>
                    <form role="form" onSubmit={handleUpdatePassword}>
                        <div className="box-body">
                            <input
                                className="styledInput"
                                type="password"
                                name="currentPassword"
                                required
                                value={userPassword.currentPassword}
                                onChange={handleChangePassword}
                                placeholder="Current password"
                            />
                            <input
                                className="styledInput"
                                type="password"
                                name="newPassword"
                                required
                                value={userPassword.newPassword}
                                onChange={handleChangePassword}
                                placeholder="New password"
                            />
                            <input
                                className="styledInput"
                                type="password"
                                name="confirmNewPassword"
                                required
                                value={userPassword.confirmNewPassword}
                                onChange={handleChangePassword}
                                placeholder="Repeat new password"
                            />
                        </div>
                        <Button
                            className="button"
                            type='submit'
                            variant="contained"
                            color="teal"
                            sx={{ margin: "10px 0" }}
                        >
                            Update
                        </Button>
                    </form>
                </div>
            </div>
        </ThemeProvider >
    )
}

export default Profile
