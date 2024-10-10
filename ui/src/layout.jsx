import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

function Layout() {
  const location = useLocation();

  const hideRegularHeader = location.pathname.startsWith("/register");
  const hideFooter = location.pathname.startsWith("/register");

  return (
    <>
      {!hideRegularHeader && <Header />}
      <Outlet /> 
      {!hideFooter && <Footer />}
    </>
  );
}

export default Layout;
