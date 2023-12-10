/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, ChangeEvent } from "react";
import { toast } from "react-toastify";
import { UpdatePassword, UserData } from "../types/types";
import axiosPrivate from "../api/axios";

const USER_URL = "/user/";

const useUser = () => {
    const [userRank, setUserRank] = useState<any>([]);
    const [userData, setUserData] = useState<UserData>({
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
        setUserData((prevData) => ({
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
        await axiosPrivate.get(USER_URL + "me")
            .then(response => {
                setUserData(response.data.user);
            })
            .catch(error => {
                toast.error(error.data.message)
            })

    };

    const getUserRank = async () => {
        await axiosPrivate.get(USER_URL + "rank")
            .then(response => {
                setUserRank(response.data);
            })
            .catch(error => {
                toast.error(error.data.message)
            })
    };

    const updateProfile = async () => {
        axiosPrivate.put(USER_URL + `update`, {
            firstname: userData.firstname,
            lastname: userData.lastname,
            city: userData.city,
            country: userData.country,
            phone: userData.phone,
            occupation: userData.occupation,
            organization: userData.organization
        })
            .then(() => {
                toast.success("Profile updated successfully!");
            })
            .catch(error =>
                toast.error(error.data.message))
        toast.success("Profile updated successfully!");
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

        await axiosPrivate.put(
            USER_URL + `update/password`,
            {
                currentPassword: userPassword.currentPassword,
                newPassword: userPassword.newPassword
            },
        )
            .then(() => {
                toast.success("Password updated successfully!");
            })
            .catch(error =>
                toast.error(error.response.data)
            )

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