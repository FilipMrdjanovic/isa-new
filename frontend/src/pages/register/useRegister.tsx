import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const useRegister = () => {
    const navigator = useNavigate()
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
            const response = await fetch(`${process.env.REACT_APP_API}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                console.log('Registration successful');
                toast.success("Registration success!")
                navigator("/login")

            } else {
                console.error('Registration failed');
                toast.error("Registration failed!")
                // Handle registration failure, show an error message, or take appropriate action
            }
        } catch (error) {
            console.error('Error during registration:', error);
        }
    };

    return {
        formData,
        handleChange,
        register
    };
};

export default useRegister;
