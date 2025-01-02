import {useState} from "react";
import axios from "axios";
import React from "react";
import "./Client.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Client = () => {
  const [formData,setFormData] =useState({
    name : "",email: "",password:""
  })
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };
  const navigate=useNavigate();
  const handleCreateAccount= async(e)=> {
    e.preventDefault();
  
    try {
      
      const response = await axios.post("${VITE_BACKEND_URL}/register/client", formData);
      if (response.data.message === "Email already exists") {
        alert("The email address is already registered. Please use a different email.");
      } else {
        console.log("Account created successfully:", response.data);
        alert("Account created successfully!");
        navigate("/Login");
        }
        
  
    } catch (error) {
      
      console.error("There was an error creating the account:", error);
    }
  };
            
  
  return (
    <div className="form-container">
      <div className="social-login">
        <button className="social-button apple">Continue with Apple</button>
        <button className="social-button google">Continue as Google</button>
      </div>
      <div className="separator">
        <span>or</span>
      </div>
      <form>
        <div className="input-group">
        <input
            type="text"
            placeholder="Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
           
        </div>
        <div className="input-field">
        <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="input-field">
        <input
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
      
        <button type="submit" className="submit-button" onClick={handleCreateAccount}>Create my account</button>
      </form>
      <div className="login-link">
        Already have an account? <Link to="/login">Login</Link>
      </div>
    </div>
  );
};

export default Client;
