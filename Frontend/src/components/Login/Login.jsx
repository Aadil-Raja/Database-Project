import React from "react";
import { Link } from "react-router-dom";
import "./Login.css";

const Login = () => {
  return (
    <div className="login-container">
      <div className="login-header">
        <h2>Login to Your Account</h2>
      </div>
      <form className="login-form">
        <div className="input-field">
          <input type="email" placeholder="Email Address" required />
        </div>
        <div className="input-field">
          <input type="password" placeholder="Password" required />
        </div>
        <div className="forgot-password">
          <a href="#">Forgot Password?</a>
        </div>
        <button type="submit" className="login-button">Log In</button>
      </form>
      <div className="signup-link">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </div>
    </div>
  );
};

export default Login;
