import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

import "./Login.css";

const Login = () => {
  const[email,setEmail]=useState("");
  const[password,setPassword]=useState("");
  const emailHandler =(e)=>{
    setEmail(e.target.value);
  }
  const passwordHandler =(e)=>{
    setPassword(e.target.value);
  }
    const navigate=useNavigate();

  const handlelogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post("http://localhost:3000/login", { email, password });
      console.log(response);  // Log the entire response
  
      if (response.data.message === "exist") {
        console.log("Login successful!");
        localStorage.setItem('token',response.data.token);
        navigate("/About");
      } else if (response.data === "notexist") {
        console.log("User does not exist, please sign up.");
        alert("Signup First");
      } else {
        console.log("Unexpected response:", response.data);
        alert("Failed to login");
      }
    } catch (err) {
      alert("Failed to login");
      console.error('Error during login:', err);
    }
  }
  

  return (
    <div className="login-container">
      <div className="login-header">
        <h2>Login to Your Account</h2>
      </div>
      <form className="login-form">
        <div className="input-field">
          <input type="email" placeholder="Email Address" required onChange={emailHandler} />
        </div>
        <div className="input-field">
          <input type="password" placeholder="Password" required  onChange={passwordHandler}/>
        </div>
        <div className="forgot-password">
          <a href="#">Forgot Password?</a>
        </div>
        <button type="submit" className="login-button" onClick={handlelogin}>Log In</button>
      </form>
      <div className="signup-link">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </div>
    </div>
  );
};

export default Login;
