import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';

const ClientProtectedRoute = () => {
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    const verifyClientAccess = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/verify-client', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.status === 200) {
          setIsAuthorized(true); // Authorized
        }
      } catch (error) {
        console.error('Authorization failed:', error);
        setIsAuthorized(false); // Unauthorized
        localStorage.removeItem('token');
        localStorage.removeItem('user_ID');
        localStorage.removeItem('usertype');
      }
    };

    verifyClientAccess();
  }, []);

  if (isAuthorized === null) {
    return <p>Loading...</p>; // Show loading state while verifying
  }

  return isAuthorized ? <Outlet /> : <Navigate to="/Login" replace />;
};

export default ClientProtectedRoute;
