import React, { useState } from "react";
import axios from "axios";
import "./sp.css";
import { Link } from "react-router-dom";

const SP = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    country: "Pakistan",  // Default value
    tips: false,
    terms: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    if (!formData.terms) {
      alert("You must agree to the terms and conditions.");
      return;
    }
    try {
      const response = await axios.post("http://localhost:3000/register/sp", formData);
      console.log("Account created successfully:", response.data);
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
      <form onSubmit={handleCreateAccount}>
        <div className="input-group">
          <input
            type="text"
            placeholder="First name"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            placeholder="Last name"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="input-field">
          <input
            type="email"
            placeholder="Work email address"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="input-field">
          <input
            type="password"
            placeholder="Password (8 or more characters)"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="input-field">
          <select
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            required
          >
            <option value="Pakistan">Pakistan</option>
            <option value="India">India</option>
            <option value="United States">United States</option>
            <option value="Canada">Canada</option>
            {/* Add more countries as needed */}
          </select>
        </div>
        <div className="checkbox-group">
          <input
            type="checkbox"
            id="tips"
            name="tips"
            checked={formData.tips}
            onChange={handleInputChange}
          />
          <label htmlFor="tips">
            Send me emails with tips on how to find talent that fits my needs.
          </label>
        </div>
        <div className="checkbox-group">
          <input
            type="checkbox"
            id="terms"
            name="terms"
            checked={formData.terms}
            onChange={handleInputChange}
            required
          />
          <label htmlFor="terms">
            Yes, I understand and agree to the ServiceProvider Terms of Service, including the <a href="#">User Agreement</a> and <a href="#">Privacy Policy</a>.
          </label>
        </div>
        <button type="submit" className="submit-button">
          Create my account
        </button>
      </form>
      <div className="login-link">
        Already have an account? <Link to="/login">Login</Link>
      </div>
    </div>
  );
};

export default SP;
