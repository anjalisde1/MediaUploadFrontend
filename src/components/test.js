  // "proxy": "http://localhost:5000",
  import React, { useEffect } from 'react';
  import API from '../utils/api';  // Make sure you've set up your API instance with Axios
  
  const TestConnection = () => {
    useEffect(() => {
      // Make a test GET request to the backend
      const checkConnection = async () => {
        try {
          const response = await API.get('/test');  // Call the test route on your backend
          console.log(response.data);  // Should log { message: 'Backend is connected' }
          alert('Frontend and Backend are connected!');
        } catch (error) {
          console.error('Error connecting to backend:', error);
          alert('Failed to connect to the backend!');
        }
      };
      checkConnection();
    }, []);  // Runs once when the component mounts
  
    return <div>Test Connection</div>;
  };
  
  export default TestConnection;
  