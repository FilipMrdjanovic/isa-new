import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const useLogin = () => {
    const navigator = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleChange = (event: any) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const login = async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API}/auth/authenticate`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                console.log(response.data);
                toast.success("Login successful!");
                navigator("/");
            } else {
                console.error(response.data);
                toast.error("Login failed!");
                // Handle login failure, show an error message, or take appropriate action
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    return {
        formData,
        handleChange,
        login
    };
};

export default useLogin;
