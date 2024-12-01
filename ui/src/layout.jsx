import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import axios from 'axios';
import Header from "./components/Header/Header";
import ClientHeader from "./components/Header(client)/Header(client)";
import SpHeader from "./components/Header(sp)/Header(sp)";
import Footer from "./components/Footer/Footer";
import Notification from "./components/Notification/NotifcationComponent";

function Layout() {
  const location = useLocation();
  const [isClientAuthorized, setIsClientAuthorized] = useState(null);
  const [isSpAuthorized, setIsSpAuthorized] = useState(null);

  // Regular expressions to match routes for client and service provider
  const clientRoutePatterns = [
    /^\/Categories(\/\d+)?$/, // Matches /Categories and /Categories/:categoryId
    /^\/ClientDashBoard$/, // Matches /ClientDashBoard
    /^\/Clientchat$/, // Matches /Clientchat
    /^\/Home$/, // Matches /Home
    /^\/Categories\/\d+\/\d+\/servicerequestform$/, // Matches /Categories/:categoryId/:serviceId/servicerequestform
    /^\/About$/, // Matches /About
    /^\/ViewProfile$/, // Matches /ViewProfile
    /^\/ViewProfile\/\d+$/, // Matches /ViewProfile/:sp_id (dynamic sp_id)
  ];
  

  const spRoutePatterns = [
    /^\/Requests$/, // Matches /Requests
    /^\/ServiceProviderForm$/, // Matches /ServiceProviderForm
    /^\/SpHistory$/, // Matches /SpHistory
    /^\/SpProfile$/, // Matches /SpProfile
    /^\/Home$/, // Matches /Home (if also used by SP)
    /^\/RequestCategory$/,
    /^\/About$/, 
    /^\/Spchat$/,
    /^\/SpBilling$/  // Matches /RequestCategory
  ];

  // Check if the current path matches any of the patterns
  const matchesPattern = (patterns) => {
    return patterns.some((pattern) => pattern.test(location.pathname));
  };

  // Authorization check for Client
  useEffect(() => {
    const verifyClientAccess = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/verify-client', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.status === 200) {
          setIsClientAuthorized(true);
        }
      } catch (error) {
        setIsClientAuthorized(false);
      }
    };

    verifyClientAccess();
  }, []);

  // Authorization check for Service Provider
  useEffect(() => {
    const verifyServiceProviderAccess = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/verify-serviceprovider', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.status === 200) {
          setIsSpAuthorized(true);
        }
      } catch (error) {
        setIsSpAuthorized(false);
      }
    };

    verifyServiceProviderAccess();
  }, []);

  // Determine which header to show
  const showClientHeader = isClientAuthorized && matchesPattern(clientRoutePatterns);
  const showSpHeader = isSpAuthorized && matchesPattern(spRoutePatterns);

  // Conditions to hide footer and notification
  const hideFooter = ["/register",'/login', "/Admin",'/resetPassword', "/ClientDashBoard","/SpHistory","/Spchat","/Clientchat",'/admin/dashboard','/admin/login'
].includes(location.pathname);
  const hideHeader = ['/admin/dashboard','/admin/login','/resetPassword'
].includes(location.pathname);
  const hideNotification = [
    "/register", "/Home", "/About", "/Login",
    "/Clientchat", "/Spchat", "/", "/Register", 
    "/Requests", "/SP", "/SpProfile", "/Admin",
    "/SpHistory", "/SpBilling", "/Client", 
    ,"/forgotpassword","/resetpassword","/RequestCategory","/ServiceProviderForm",'/admin/dashboard','/admin/login','/login'
      ,'/resetPassword',

  ].includes(location.pathname);

  return (
    <>
      {isClientAuthorized === null && isSpAuthorized === null ? (
        <p>Loading...</p> // Show loading state while verifying
      ) : showClientHeader ? (
        <ClientHeader />
      ) : showSpHeader ? (
        <SpHeader />
      ) : (
        !hideHeader && <Header />
      )}
      {!hideNotification && <Notification />}
      <Outlet />
      {!hideFooter && <Footer />}
    </>
  );
}

export default Layout;
