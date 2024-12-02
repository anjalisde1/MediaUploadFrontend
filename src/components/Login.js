// components/Login.js
import React from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import toastify styles
import API from '../utils/api';
import {jwtDecode} from 'jwt-decode';
import './Login.css'; // Import external CSS for styling

const Login = ({onLoginSuccess}) => {
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
      toast.success('Login successful! Welcome to the app!');
    } catch (error) {
      console.error('Authentication failed:', error);
      toast.error('Login failed. Please try again.');
    }
  };

  const handleFailure = () => {
    toast.error('Google login failed. Please try again.');
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <div className="login-container">
        <div className="login-card">
          <h2 className="login-title">Welcome to Media App</h2>
          <p className="login-subtitle">Login to continue</p>
          <div className="google-button">
            <GoogleLogin onSuccess={onLoginSuccess} onError={handleFailure} />
          </div>
        </div>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;


// // components/Login.js
// import React from 'react';
// import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
// import API from '../utils/api';
// import {jwtDecode} from 'jwt-decode'

// const Login = () => {
//   const handleSuccess = async (credentialResponse) => {
//     try {
//       // Decode JWT (optional: to view user data from Google)
//       const userData = jwtDecode(credentialResponse.credential); // Needs `jwt-decode` library
//       const { sub: googleId, name, email } = userData;

//       // Send data to your backend
//       const res = await API.post('/auth/google', { googleId, name, email });
      
//       // Save token to local storage
//       localStorage.setItem('token', res.data.token);
//       alert('Login successful!');
//     } catch (error) {
//       console.error('Authentication failed:', error);
//       alert('Login failed. Please try again.');
//     }
//   };

//   const handleFailure = () => {
//     alert('Google login failed. Please try again.');
//   };

//   return (
//     <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
//       <div>
//         <h2>Login</h2>
//         <GoogleLogin
//           onSuccess={handleSuccess}
//           onError={handleFailure}
//         />
//       </div>
//     </GoogleOAuthProvider>
//   );
// };

// export default Login;
