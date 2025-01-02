import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';

const ServiceProviderProtectedRoute = () => {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

  useEffect(() => {
    const verifyServiceProviderAccess = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${BASE_URL}/verify-serviceprovider`, {
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

    verifyServiceProviderAccess();
  }, []);

  if (isAuthorized === null) {
    return <p>Loading...</p>;
  }

  return isAuthorized ? <Outlet /> : <Navigate to="/Login" replace />;
};

export default ServiceProviderProtectedRoute;
