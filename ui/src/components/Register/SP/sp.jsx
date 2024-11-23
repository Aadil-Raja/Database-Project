import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCheckbox,
  MDBInput,
  MDBIcon,
  MDBRadio
} from 'mdb-react-ui-kit';
import { useNavigate } from "react-router-dom";
import "./sp.css";
import '../../Header/Header.jsx'

const SP = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    city_id: "",
    gender: "",
    dob: "",
    status: "active",
    tips: false,
    terms: false,
  });
  const [cities, setCities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get("http://localhost:3000/cities");
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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address (e.g., user@example.com).");
      return;
    }
    const phoneRegex = /^\d+$/;
  if (!phoneRegex.test(formData.phone)) {
    alert("Phone number must contain only digits.");
    return;
  }
  const today = new Date();
  const enteredDate = new Date(formData.dob);
  if (enteredDate > today) {
    alert("Date of Birth cannot be in the future.");
    return;
  }
    if (!formData.terms) {
      alert("You must agree to the terms and conditions.");
      return;
    }
    try {
      const response = await axios.post("http://localhost:3000/register/sp", formData);
      if (response.data.message === "Email already exists") {
        alert("The email address is already registered. Please use a different email.");
      } else if (response.data.message === "User Created Successfully") {
        alert("Account created successfully!");
        navigate("/Login");
      }
    } catch (error) {
       alert("Make sure to fill all details.")
      console.error("There was an error creating the account:", error);
    }
  };

  return (
    <MDBContainer fluid className="d-flex justify-content-center align-items-center register-sp-body" >
      <MDBCard className="m-5" style={{ maxwidth: "800px" }}>
        <MDBCardBody className="px-5">
          <h3 className="text-center fw-bold mb-4">Service Provider Registration</h3>
          <form onSubmit={handleCreateAccount}>
            <MDBRow>
              <MDBCol md="6">
                <div className="d-flex flex-row align-items-center mb-4">
                  <MDBIcon fas icon="user me-3" size="lg" />
                  <MDBInput
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    type="text"
                    required
                    className="w-100"
                  />
                </div>
              </MDBCol>
              <MDBCol md="6">
                <div className="d-flex flex-row align-items-center mb-4">
                  <MDBIcon fas icon="user me-3" size="lg" />
                  <MDBInput
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    type="text"
                    required
                    className="w-100"
                  />
                </div>
              </MDBCol>
            </MDBRow>
            
            <div className="d-flex flex-row align-items-center mb-4">
              <MDBIcon fas icon="envelope me-3" size="lg" />
              <MDBInput
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                type="email"
                required
                className="w-100"
              />
            </div>

            <div className="d-flex flex-row align-items-center mb-4">
              <MDBIcon fas icon="lock me-3" size="lg" />
              <MDBInput
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                type="password"
                required
                className="w-100"
              />
            </div>

            <MDBRow>
              <MDBCol md="6">
                <div className="d-flex flex-row align-items-center mb-4">
                  <MDBIcon fas icon="phone me-3" size="lg" />
                  <MDBInput
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    type="text"
                    required
                    className="w-100"
                  />
                </div>
              </MDBCol>
              <MDBCol md="6">
                <div className="d-flex flex-row align-items-center mb-4">
                  <MDBIcon fas icon="home me-3" size="lg" />
                  <MDBInput
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    type="text"
                    required
                    className="w-100"
                  />
                </div>
              </MDBCol>
            </MDBRow>

            <div className="mb-4">
              <select name="city_id" value={formData.city_id} onChange={handleInputChange} required className="form-select">
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city.city_id} value={city.city_id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            <MDBRow className="mb-4">
              <MDBCol md="6">
                <MDBInput
                  label="Date of Birth"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  type="date"
                  required
                  className="w-100"
                />
              </MDBCol>
              <MDBCol md="6" className="d-flex align-items-center">
                <h6 className="fw-bold me-3">Gender:</h6>
                <MDBRadio name="gender" value="female" label="Female" inline onChange={handleInputChange} />
                <MDBRadio name="gender" value="male" label="Male" inline onChange={handleInputChange} />
                <MDBRadio name="gender" value="other" label="Other" inline onChange={handleInputChange} />
              </MDBCol>
            </MDBRow>

            <div className="mb-4">
              <MDBCheckbox
                name="tips"
                label="Send me emails with tips on how to find talent that fits my needs."
                checked={formData.tips}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-4">
              <MDBCheckbox
                name="terms"
                label={
                  <span>
                    Yes, I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
                  </span>
                }
                checked={formData.terms}
                onChange={handleInputChange}
                required
              />
            </div>

            <MDBBtn type="submit" className='mb-4 w-100 sp-gradient-custom-4' size='lg'>Register</MDBBtn>
          </form>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default SP;
