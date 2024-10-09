import React, { useState } from "react";
import axios from "axios";
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCol,
  MDBCardBody,
  MDBInput,
  MDBIcon,
  MDBCheckbox
} from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";
import "./Client.css"; // Optional: For any additional custom styling

const Client = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match. Please check and try again.");
      return;
    }

    if (!formData.agreeToTerms) {
      alert("You must agree to the terms of service.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/register/client", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      if (response.data.message === "Email already exists") {
        alert("The email address is already registered. Please use a different email.");
      } else {
        alert("Account created successfully!");
        navigate("/login");
      }
    } catch (error) {
      console.error("There was an error creating the account:", error);
    }
  };

  return (
    <MDBContainer fluid className='d-flex align-items-center justify-content-center bg-image' >
     <MDBCol xl="10" lg="9" md="9" sm="9" xs="5" className='d-flex justify-content-center'>
      <MDBCard className='m-5' style={{ width: '600px', padding: '50px', zIndex: 1 }}>
        <MDBCardBody className='px-5'>
          <h2 className="text-uppercase text-center mb-5">Sign Up</h2>
          <form onSubmit={handleCreateAccount}>
            <div className="d-flex flex-row align-items-center mb-4">
              <MDBIcon fas icon="user me-3" size='lg' />
              <MDBInput
                wrapperClass='w-100'
                label='Your Name'
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                type='text'
                size='lg'
                required
              />
            </div>
            <div className="d-flex flex-row align-items-center mb-4">
              <MDBIcon fas icon="envelope me-3" size='lg' />
              <MDBInput
                wrapperClass='w-100'
                label='Your Email'
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                type='email'
                size='lg'
                required
              />
            </div>
            <div className="d-flex flex-row align-items-center mb-4">
              <MDBIcon fas icon="lock me-3" size='lg' />
              <MDBInput
                wrapperClass='w-100'
                label='Password'
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                type='password'
                size='lg'
                required
              />
            </div>
            <div className="d-flex flex-row align-items-center mb-4">
              <MDBIcon fas icon="key me-3" size='lg' />
              <MDBInput
                wrapperClass='w-100'
                label='Repeat your password'
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                type='password'
                size='lg'
                required
              />
            </div>
            <div className='d-flex flex-row justify-content-center mb-4'>
              <MDBCheckbox
                name='agreeToTerms'
                id='flexCheckDefault'
                label='I agree to all statements in Terms of service'
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
              />
            </div>
            <MDBBtn type="submit" className='mb-4 w-100 client-gradient-custom-4' size='lg'>Register</MDBBtn>
          </form>
        </MDBCardBody>
      </MDBCard>
      </MDBCol>
    </MDBContainer>
  );
};

export default Client;
