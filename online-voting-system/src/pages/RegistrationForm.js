import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegistrationForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        dob: '',
        address: '',
        email: '',
        password: '',
        confirmPassword: '',
        citizenshipNo: '',
        mobileNo: '',
        file: null,
    });
    const [errors, setErrors] = useState({
        email: '',
        confirmPassword: '',
        phone: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData((prevData) => ({
            ...prevData,
            file,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reset errors before submitting
        setErrors({
            email: '',
            confirmPassword: '',
            phone: '',
        });

        // Form validation
        if (!formData.fullName || !formData.dob || !formData.address || !formData.email ||
            !formData.password || !formData.confirmPassword ||
            !formData.citizenshipNo || !formData.mobileNo || !formData.file) {
            alert('Please fill in all required fields.');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        // Prepare FormData object
        const data = new FormData();
        data.append('full_name', formData.fullName);
        data.append('date_of_birth', formData.dob);
        data.append('address', formData.address);
        data.append('email', formData.email);
        data.append('password', formData.password);
        data.append('confirm_password', formData.confirmPassword);
        data.append('citizenship_no', formData.citizenshipNo);
        data.append('phone', formData.mobileNo);
        data.append('image', formData.file);

        try {
            const response = await axios.post('http://127.0.0.1:8000/user/register/', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Handle success response
            console.log(response.data);
            alert('Registration Successful');
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data) {
                // Handle validation errors
                const errorResponse = err.response.data;
                setErrors({
                    email: errorResponse.email ? errorResponse.email[0] : '',
                    confirmPassword: errorResponse.confirm_password ? errorResponse.confirm_password[0] : '',
                    phone: errorResponse.phone ? errorResponse.phone[0] : '',
                });
            }
        }
    };

    return (
        <div className="registration-form">
            <h1>Registration Form</h1>
            <form onSubmit={handleSubmit}>
                {/* Personal Details Section */}
                <fieldset>
                    <legend>Personal Details</legend>
                    <div>
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Date of Birth</label>
                        <input
                            type="date"
                            name="dob"
                            value={formData.dob}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Address</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        {errors.email && <p className="error">{errors.email}</p>}
                    </div>
                    <div>
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                        {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
                    </div>
                </fieldset>

                {/* Identity Details Section */}
                <fieldset>
                    <legend>Identity Details</legend>
                    <div>
                        <label>Citizenship No</label>
                        <input
                            type="text"
                            name="citizenshipNo"
                            value={formData.citizenshipNo}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <label>Mobile No</label>
                        <input
                            type="text"
                            name="mobileNo"
                            value={formData.mobileNo}
                            onChange={handleChange}
                        />
                        {errors.phone && <p className="error">{errors.phone}</p>}
                    </div>
                    <div>
                        <label>Upload Your Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>
                </fieldset>

                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default RegistrationForm;
