import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

function Layout() {
  const location = useLocation();

  const hideRegularHeader = [
    "/register",
    
].includes(location.pathname);

const hideFooter = [
  "/register",

].includes(location.pathname);
  return (
    <>
      {!hideRegularHeader && <Header />}
      <Outlet /> 
      {!hideFooter && <Footer />}
    </>
  );
}

export default Layout;
