import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null for loading state
  const token = localStorage.getItem('token'); // Get the token from localStorage

  useEffect(() => {
    const verifyToken = async () => {
      try {
        if (!token) {
          setIsAuthenticated(false);
          return;
        }

        // Make a request to the backend to verify the token
        const response = await axios.get('http://localhost:3000/verify-token', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.isValid) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error verifying token:', error);
        setIsAuthenticated(false); // Set to false in case of an error
      }
    };

    verifyToken();
  }, [token]);

  // While checking authentication, show a loading indicator
  if (isAuthenticated === null) {
    return <div>Loading...</div>; // You can replace this with a spinner or loading component
  }

  if (!isAuthenticated) {
    return <Navigate to="/Login" replace />; // Redirect to the login page if not authenticated
  }

  return <Outlet />; // Render the child routes if authenticated
};

export default ProtectedRoute;
