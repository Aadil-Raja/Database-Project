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

  // Authorization check
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

  // Service Provider Authorization Check
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


  // Conditional component rendering based on authorization state
  const clientPages = ["/Categories", "/ClientDashboard", "/Clientchat","/Home"];
  const spPages = ["/Requests", "/ServiceProviderForm", "/SpHistory", "/SpProfile","/Home"];
  const showClientHeader = isClientAuthorized && clientPages.includes(location.pathname);
  const showSpHeader = isSpAuthorized && spPages.includes(location.pathname);

  const hideFooter = ["/register", "/Admin"].includes(location.pathname);
  const hideNotification = [
    "/register","/Home", "/About","/Login",
    "/Clientchat", "/Spchat", "/", "/Register", "/Categories",
    "/Requests", "/SP", "/SpProfile", "/Admin",
    "/SpHistory", "/SpBilling","/Client"
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
        <Header />
      )}
      {!hideNotification && <Notification />}
      <Outlet />
      {!hideFooter && <Footer />}
    </>
  );
}

export default Layout;
