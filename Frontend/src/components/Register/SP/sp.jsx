import React, { useState, useEffect } from "react";
import axios from "axios";
import "./sp.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const SP = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    city_id: 0,  // Fix: use city_id
    gender: "",
    dob: "",
    status: "active",
    tips: false,
    terms: false,
  });
  const [cities, setCities] = useState([]);
  const navigate=useNavigate();
  useEffect(() => {
    // Fetch cities from backend when the component loads
    const fetchCities = async () => {
      try {
        const response = await axios.get("${VITE_BACKEND_URL}/cities");
        setCities(response.data);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };
    fetchCities();
  }, []);

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
      const response = await axios.post("${VITE_BACKEND_URL}/register/sp", formData);
      if (response.data.message === "Email already exists") {
        alert("The email address is already registered. Please use a different email.");
      } else if (response.data.message==="User Created Successfully") {
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
        <button className="social-button google">Continue with Google</button>
      </div>
      <div className="separator">
        <span>or</span>
      </div>
      <form onSubmit={handleCreateAccount}>
        {/* First Name Field */}
        <div className="input-group">
          <input
            type="text"
            placeholder="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Last Name Field */}
        <div className="input-group">
          <input
            type="text"
            placeholder="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Email Field */}
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

        {/* Password Field */}
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

        {/* Phone Field */}
        <div className="input-field">
          <input
            type="text"
            placeholder="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Address Field */}
        <div className="input-field">
          <input
            type="text"
            placeholder="Address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* City Selection Field */}
        <div className="input-field">
          <select name="city_id" value={formData.city_id} onChange={handleInputChange} required>
            <option value="">Select City</option>
            {cities.map((city) => (
              <option key={city.city_id} value={city.city_id}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        {/* Gender Selection */}
        <div className="input-field">
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Date of Birth Field */}
        <div className="input-field">
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Tips Checkbox */}
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

        {/* Terms and Conditions */}
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
            Yes, I understand and agree to the Service Provider Terms of Service, including the <a href="#">User Agreement</a> and <a href="#">Privacy Policy</a>.
          </label>
        </div>

        {/* Submit Button */}
        <button type="submit" className="submit-button">
          Create my account
        </button>
      </form>

      {/* Login Link */}
      <div className="login-link">
        Already have an account? <Link to="/login">Login</Link>
      </div>
    </div>
  );
};

export default SP;
