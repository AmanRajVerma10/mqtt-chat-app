import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [errorMessage, setErrorMessage] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm();
  const history = useHistory();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', data);
      localStorage.setItem('token', response.data.token); // Store JWT in localStorage
      history.push('/dashboard'); // Redirect to dashboard
    } catch (error) {
      setErrorMessage(error.response?.data.message || 'An error occurred');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit(onSubmit)} className="w-96 p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700">Username</label>
          <input
            type="text"
            id="username"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
            placeholder="Enter your username"
            {...register('username', { required: 'Username is required' })}
          />
          {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none"
            placeholder="Enter your password"
            {...register('password', { required: 'Password is required' })}
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">Login</button>

        <p className="mt-4 text-center text-sm">
          Don't have an account? <Link to="/register" className="text-blue-500 underline">Register here</Link>
        </p>
      </form>
    </div>
  );
}
