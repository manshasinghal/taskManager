import React, { useState } from 'react';
import axios from 'axios';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const response = await axios.post('http://localhost:5000/api/signup', {
        email,
        password
      });
      setMessage(response.data.message);
      
      setEmail('');
      setPassword('');
    } catch (error) {
      if (error.response) {
        setMessage('Signup failed: ' + error.response.data.message);
      } else {
        setMessage('Signup failed: ' + error.message);
      }
      console.error('Signup failed:', error);
    }
  };

  return (
    <form onSubmit={handleSignup} className="flex flex-col space-y-4 p-4 bg-gray-50 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 text-center">Sign Up</h2>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
        required
        className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
        required
        className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      <button type="submit" className="p-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-all duration-200">
        Sign Up
      </button>
      {message && <p className="text-center text-sm mt-2">{message}</p>}
    </form>
  );
};

export default Signup;
