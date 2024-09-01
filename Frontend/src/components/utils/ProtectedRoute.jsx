// src/components/utils/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token'); // Get the token from localStorage

  if (!token) {
    return <Navigate to="/Login" replace />; // Redirect to the Login page if not authenticated
  }

  return <Outlet />; // Render the child routes if authenticated
};

export default ProtectedRoute;
