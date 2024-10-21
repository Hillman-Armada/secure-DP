import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();  // For redirecting to the previous page

    const handleLogin = async (e) => {
        e.preventDefault();
    
        try {
            const response = await axios.post('http://127.0.0.1:5000/api/login', { email, password });

            if (response.data.token) {
                // Store the token and is_admin flag in localStorage
                localStorage.setItem('token', response.data.token);
                const isAdmin = response.data.is_admin;
                localStorage.setItem('is_admin', isAdmin ? 'true' : 'false');

                // Redirect based on is_admin status
                if (isAdmin) {
                    navigate('/admin-dashboard');
                } else {
                    const redirectTo = location.state?.from || '/';
                    navigate(redirectTo);
                }
            } else {
                setError('Login failed. Please check your credentials.');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Login failed. Please try again.');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Login</h1>
            <form onSubmit={handleLogin}>
                <div className="mb-4">
                    <label className="block mb-2">Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border p-2 w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border p-2 w-full"
                        required
                    />
                </div>
                <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
                    Login
                </button>
                {error && <p className="text-red-500 mt-2">{error}</p>}
            </form>
        </div>
    );
};

export default Login;
