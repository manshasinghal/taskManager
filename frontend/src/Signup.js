import { useState } from 'react';
import axios from 'axios';

const Signup = ({ onSignupSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isCapturingGeolocation, setIsCapturingGeolocation] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsCapturingGeolocation(true);

    try {
     
      const deviceDetails = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
      };

      let geolocation = null;
      if ("geolocation" in navigator) {
        try {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 10000,
              enableHighAccuracy: false,
            });
          });
          geolocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
        } catch (error) {
          console.warn("Geolocation capture failed:", error.message);
          geolocation = { error: "Geolocation access denied or timed out" };
        }
      } else {
        geolocation = { error: "Geolocation not supported" };
      }

     
      const response = await axios.post('http://localhost:5000/api/signup', {
        email,
        password,
        deviceDetails,
        geolocation,
      });

      setMessage(response.data.message);
      
      const newUserId = response.data.user.id;
      const newUserData = { email: response.data.user.email, id: newUserId };
      onSignupSuccess(newUserData);

      // Clear form on success
      setEmail('');
      setPassword('');
      
    } catch (error) {
      if (error.response) {
        setMessage('Signup failed: ' + error.response.data.message);
      } else {
        setMessage('Signup failed: ' + error.message);
      }
      console.error("Error signing up:", error);
    } finally {
      setIsCapturingGeolocation(false);
    }
  };

  return (
    <form onSubmit={handleSignUp} className="flex flex-col space-y-4">
      <h2 className="text-2xl font-semibold text-center mb-4">Sign Up</h2>
      <input
        type="email"
        name="email"
        placeholder="Email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
      />
      <button
        type="submit"
        className="p-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        disabled={isCapturingGeolocation}
      >
        {isCapturingGeolocation ? 'Signing up...' : 'Sign Up'}
      </button>
      {message && <p className="text-red-500 text-center">{message}</p>}
    </form>
  );
};

export default Signup;
