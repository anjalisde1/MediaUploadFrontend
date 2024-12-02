import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import MediaUpload from './components/MediaUpload';
import ErrorBoundary from './components/errorBoundary';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toastify styles
import API from './utils/api';
import {jwtDecode} from 'jwt-decode';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if the token exists in localStorage on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true); // User is logged in
    }
  }, []);
  console.log('first')

  // Handle login success (set state and trigger rendering)
  const handleSuccess = async (credentialResponse) => {
    try {
      // Decode JWT to get user data
      const userData = jwtDecode(credentialResponse.credential);
      const { sub: googleId, name, email } = userData;

      // Send user data to the backend
      const res = await API.post('/auth/google', { googleId, name, email });

      // Save token to local storage
      localStorage.setItem('token', res.data.token);
      console.log("tokeennn", res.data.token)

      // Show success toast
      toast.success('Login Success', { toastId: 'loginSuccess' });
      setIsLoggedIn(true)
      toast.success('Login Success', { toastId: 'loginSuccess' });

    } catch (error) {
      console.error('Authentication failed:', error);
      toast.error('Login failed. Please try again.', { toastId: 'loginError' });
    }
  };


  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    setIsLoggedIn(false); // Update state to logged out
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Media Upload App</h1>

      {isLoggedIn ? (
        <>
          {/* Show MediaUpload page if logged in */}
          <ErrorBoundary>
            <MediaUpload />
          </ErrorBoundary>
          <button
            onClick={handleLogout}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Logout
          </button>
        </>
      ) : (
        // Show Login page if not logged in
        <Login onLoginSuccess={handleSuccess} />
      )}
    </div>
  );
};

export default App;