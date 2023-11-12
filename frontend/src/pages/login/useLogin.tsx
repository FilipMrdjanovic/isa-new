import { useState, ChangeEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../../api/axios';
import { useAuth } from '../../api/auth/AuthContext';

interface FormData {
    email: string;
    password: string;
}

const useLogin = () => {
    const navigate = useNavigate();
    const location = useLocation()
    const auth = useAuth()

    const [formData, setFormData] = useState<FormData>({
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
            if (response.data.statusCodeValue === 200) {

                const redirectPath = location.state?.path || '/dashboard'
                auth.login(response.data.body)
                navigate(redirectPath, { replace: true })
            } else {
                toast.error(response.data.body);
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
