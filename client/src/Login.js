import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ setToken }) => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/login', { login, password });
            setToken(res.data.token);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" value={login} onChange={(e) => setLogin(e.target.value)} placeholder="Login" required />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;
