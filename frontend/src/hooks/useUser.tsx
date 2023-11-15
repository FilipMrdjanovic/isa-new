/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, ChangeEvent } from "react";
import axiosPrivate from "../api/axios";
import { toast } from "react-toastify";
import { UpdatePassword, UserData } from "../types/types";

const USERS_URL = "/user/";

const useUser = () => {
    const [userRank, setUserRank] = useState<any>([]);
    const [userData, serUserData] = useState<UserData>({
        email: "",
        firstname: "",
        lastname: "",
        city: "",
        country: "",
        phone: "",
        jmbg: "",
        gender: "",
        occupation: "",
        organization: "",
        penaltyPoints: "",
        loyaltyPoints: "",
    });
    const [userPassword, setUserPassword] = useState<UpdatePassword>({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: ""
    })

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        serUserData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };
    const handleChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setUserPassword((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const fetchUserData = async () => {
        try {
            const response = await axiosPrivate.get(USERS_URL + "me");
            const userData = response.data;
            serUserData(userData);
        } catch (error) {
            toast.error("Failed to fetch user data");
        }
    };

    const getUserRank = async () => {
        try {
            const response = await axiosPrivate.get(USERS_URL + "rank");
            setUserRank(response.data);
        } catch (error) {
            toast.error("There is a problem with user's rank.")
        }
    };

    const updateProfile = async () => {
        try {
            await axiosPrivate.put(USERS_URL + `update`, {
                firstname: userData.firstname,
                lastname: userData.lastname,
                city: userData.city,
                country: userData.country,
                phone: userData.phone,
                occupation: userData.occupation,
                organization: userData.organization
            });
            toast.success("Profile updated successfully!");
        } catch (error) {
            toast.error("Failed to update profile.");
        }
    };

    const updatePassword = async () => {
        if (userPassword.newPassword !== userPassword.confirmNewPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        if (userPassword.newPassword === userPassword.currentPassword) {
            toast.error("New password must be different from the old password.");
            return;
        }

        try {
            await axiosPrivate.put(
                USERS_URL + `update/password`,
                { 
                    currentPassword: userPassword.currentPassword, 
                    newPassword: userPassword.newPassword 
                },
            );
            toast.success("Password updated successfully!");
        } catch (error: any) {
            const errorMessage =
                error.response && error.response.data
                    ? error.response.data.message
                    : "Failed to update password.";
            toast.error(errorMessage);
        }
    };

    useEffect(() => {
        fetchUserData();
        getUserRank();

    }, []);

    return {
        userData,
        userPassword,
        userRank,
        handleChange,
        handleChangePassword,
        fetchUserData,
        updateProfile,
        updatePassword,
    };
};

export default useUser;