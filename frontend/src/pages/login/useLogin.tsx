import { useState, ChangeEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../../api/axios';
import { useAuth } from '../../api/auth/AuthContext';
import { LoginFormData } from '../../types/types';

const useLogin = () => {
    const navigate = useNavigate();
    const location = useLocation()
    const auth = useAuth()

    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: '',
    });

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const login = async () => {
        try {
            const response: any = await axiosInstance.post('/auth/authenticate', formData);
            if (response.data.status === 200) {
                const redirectPath = location.state?.path || '/dashboard'
                auth.login(response.data.token)
                navigate(redirectPath, { replace: true })
            } else {
                toast.error(response.data.message);
            }
        } catch (error: any) {
            console.error('Error during login: ', error.message);
        }
    };

    return {
        formData,
        handleChange,
        login,
    };
};

export default useLogin;
