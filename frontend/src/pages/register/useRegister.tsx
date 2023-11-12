import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../../api/axios';

const useRegister = () => {
    const navigator = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirm_password: '',
        firstname: '',
        lastname: '',
        city: '',
        country: '',
        phone: '',
        occupation: '',
        organization: '',
        role: '',
    });

    const handleChange = (event: any) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const register = async () => {
        // Frontend validation for password confirmation
        if (formData.password !== formData.confirm_password) {
            alert('Password and Confirm Password do not match');
            return;
        }

        try {
            const response = await axiosInstance.post('/auth/register', formData);
            if (response.data.statusCodeValue === 200) {
                toast.success(response.data.body);
                navigator('/login');
            } else {
                console.error(response.data);
                toast.error(response.data.body);
            }
        } catch (error: any) {
            console.error('Error during registration: ', error.message);
        }
    };

    return {
        formData,
        handleChange,
        register,
    };
};

export default useRegister;