import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/Header/Header";
import HeaderLogout from "./components/Header(logout)/Header(logout)";
import Footer from "./components/Footer/Footer";
import NotificationComponent from "./components/Notification/NotifcationComponent.jsx";

function Layout() {
  const location = useLocation();

  // Conditions to hide components based on the path
  const hideRegularHeader = [
    "/register",
    "/sp",
    "/client",
    "/login",
    "/Requests",
    "/forgotpassword",
    "/resetPassword",
    "/service-provider-form",
    "/SpProfile",
    "/Admin",
  ].includes(location.pathname);

  const hideNotification = [
    "/register",
    "/sp",
    "/client",
    "/login",
    "/Requests",
    "/forgotpassword",
    "/resetPassword",
    "/service-provider-form",
    "/SpProfile",
    "/Admin",
    "/chat",
  ].includes(location.pathname);

  const hideLogoutHeader = [
    "/",
    "/About",
    "/Contact",
    "/login",
    "/register",
    "/forgotpassword",
    "/resetPassword",
    "/contact",
    "/SpProfile",
    "/Admin",
  ].includes(location.pathname);

  const hideFooter = [
    "/register",
    "/sp",
    "/client",
    "/login",
    "/ServicePage",
    "/Requests",
    "/forgotpassword",
    "/resetPassword",
    "/service-provider-form",
    "/SpProfile",
    "/Admin",
  ].includes(location.pathname);

  return (
    <div className="page-container">
      {!hideLogoutHeader && <HeaderLogout />}
      {!hideRegularHeader && hideLogoutHeader && <Header />}
    

      <div className="content-wrap">
        <div className="content-body">
        {!hideNotification && <NotificationComponent />}
          <Outlet />
        </div>
      </div>

     
    </div>
  );
}

export default Layout;
