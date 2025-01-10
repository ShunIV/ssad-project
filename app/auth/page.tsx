"use client";
import React, { useState } from 'react';

const Login: React.FC = () => {
    const [username, setusername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('https://localhost:443/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('user', JSON.stringify(data));
                window.location.href = '/';
            } else {
                console.error('Login failed:', data);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div
            className="flex items-center justify-center"
            style={{ height:'calc(100vh - 105px )' ,backgroundImage: 'url(bg.png)', backgroundSize: 'cover' }}
        >
            <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-full max-w-md opacity-80 border border-yellow-500">
                <h2 className="text-2xl font-semibold text-center text-white mb-6">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                            username
                        </label>
                        <input
                            type="username"
                            id="username"
                            name="username"
                            value={username}
                            onChange={(e) => setusername(e.target.value)}
                            className="w-full p-3 mt-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-zinc-900"
                            placeholder="Enter your username"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 mt-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-zinc-900"
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-yellow-600 text-white font-semibold rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
