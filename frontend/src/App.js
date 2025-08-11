import { useState, useEffect } from 'react';
import Home from './Home';
import Signup from './Signup';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleUserLogin = (newUserData) => {
    setUser(newUserData);
    setUserId(newUserData.id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500 font-poppins text-lg">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8 flex flex-col items-center font-poppins">
      <div className="max-w-xl w-full bg-white p-10 rounded-2xl shadow-2xl border border-gray-200">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-8 tracking-tight">
          Weekly Task Manager
        </h1>

        {user ? (
          <Home user={user} setUser={setUser} userId={userId} />
        ) : (
          <Signup onSignupSuccess={handleUserLogin} />
        )}
      </div>
    </div>
  );
};

export default App;
