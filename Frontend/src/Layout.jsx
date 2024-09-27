import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/Header/Header";
import HeaderLogout from "./components/Header(logout)/Header(logout)"; // Importing Header(logout)
import Footer from "./components/Footer/Footer";

function Layout() {
    const location = useLocation();

    // Conditions to hide the regular header (e.g., for login/register pages)
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
    ].includes(location.pathname);

    // Conditions to hide the logout header (e.g., for Home, About, and Contact)
    const hideLogoutHeader = ["/","/About","/Contact", "/login", "/register","/forgotpassword","/resetPassword","/contact",
        "/SpProfile",].includes(location.pathname);

    // Conditions to hide the footer
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
    ].includes(location.pathname);

    return (
        <>
            {!hideLogoutHeader && <HeaderLogout />} {/* Show HeaderLogout if not hiding either */}
            {!hideRegularHeader && hideLogoutHeader && <Header />} {/* Show the original Header */}
            <Outlet />
            {!hideFooter && <Footer />}
        </>
    );
}

export default Layout;
