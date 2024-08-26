import React from "react";
import { Link, NavLink } from "react-router-dom";
import "./Header.css"; 

export default function Header() {
    return (
        <header className="header">
            <nav className="nav">
                <div className="nav-container">
                    <Link to="/" className="logo">
                        <span className="logo-text">
                            Service<span className="logo-highlight">Provider</span>
                        </span>
                    </Link>
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
                </div>
            </nav>
        </header>
    );
}
