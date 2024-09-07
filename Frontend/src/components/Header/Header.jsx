import React from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import "./Header.css";
import prof from "./prof.jpg";  // Importing the profile image
import search from "./search.png";  // Importing the search icon


export default function Header() {
    const location = useLocation();
    const isServicePage = location.pathname === "/ServicePage";

    return (
        <header className="header">
            <nav className="nav">
                <div className="nav-container">
                    {/* Logo Section */}
                    <Link to="/" className="logo">
                        <span className="logo-text">
                            Service<span className="logo-highlight">Provider</span>
                        </span>
                    </Link>
                    
                    {/* Search Bar for Service Page */}
                    {isServicePage && (
                        <div className="service-page-header">
                            <div className="search-bar-container">
                                <input type="text" placeholder="What service are you looking for today?" className="search-bar-input" />
                                <button className="search-bar-button">
                                    {/* Use the imported search icon */}
                                    <img src={search} alt="Search" className="h-4 w-4" />
                                </button>
                            </div>
                            <Link to="/add-request" className="add-request-button">
                                Add Request
                            </Link>
                            <div className="profile-menu group relative">
                            <button className="profile-button">
                                {/* Use the imported profile image */}
                                <img src={prof} alt="Profile" className="profile-pic" />
                            </button>
                            <div className="profile-options hidden group-hover:block">
                                <Link to="/history">History</Link>
                                <Link to="/pending-requests">Pending Requests</Link>
                                <Link to="/chats">Chats</Link>
                                <Link to="/logout">Logout</Link>
                            </div>
                        </div>

                        </div>
                    )}

                    {/* Default Links when not on Service Page */}
                    {!isServicePage && (
                        <>
                            <div className="auth-links">
                                <Link to="/login" className="login-link">
                                    Log in
                                </Link>
                                <Link to="/register" className="register-link">
                                    Register
                                </Link>
                            </div>
                            <div className="menu" id="mobile-menu-2">
                                <ul className="menu-list">
                                    <li>
                                        <NavLink to="/" className={({ isActive }) => (isActive ? "menu-item active" : "menu-item")}>
                                            Home
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/About" className={({ isActive }) => (isActive ? "menu-item active" : "menu-item")}>
                                            About
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/Contact" className={({ isActive }) => (isActive ? "menu-item active" : "menu-item")}>
                                            Contact Us
                                        </NavLink>
                                    </li>
                                </ul>
                            </div>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
}
