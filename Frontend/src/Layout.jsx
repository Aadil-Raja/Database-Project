import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

function Layout() {
    const location = useLocation();
    const hideHeader = ["/register", "/sp", "/client","/login","/Requests"].includes(location.pathname);
    const hideFooter = ["/register", "/sp", "/client","/login","/ServicePage","/Requests"].includes(location.pathname);
    
    return (
        <>
            {!hideHeader && <Header />}
            <Outlet />
            {!hideFooter && <Footer/>}
        </>
    );
}

export default Layout;
