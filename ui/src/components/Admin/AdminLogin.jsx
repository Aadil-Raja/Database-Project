// AdminLogin.jsx
import React, { useState } from 'react';
import axios from 'axios';
import {
  MDBBtn,
  MDBContainer,
  MDBCol,
  MDBInput,
  MDBCard,
  MDBCardBody,
  MDBCardImage
} from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css'; // Import the CSS file for styling

const AdminLogin = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send credentials to the server
      const response = await axios.post('http://localhost:3000/LoginAdmin', formData);

      if (response.data.message === 'Successful') {
        // Store the token securely
        localStorage.setItem('adminToken', response.data.token);
        navigate('/admin/dashboard');
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login.');
    }
  };

  return (
    <MDBContainer fluid className="d-flex align-items-center justify-content-center admin-login-bg">
      <MDBCol xl="4" lg="5" md="7" sm="9" className="d-flex justify-content-center">
        <MDBCard className="admin-login-card">
          <MDBCardBody className="px-5">
            <div className="text-center">
              <MDBCardImage
                src="http://localhost:3000/images/logo.png" // Update the logo path if necessary
                style={{ width: '185px' }}
                alt="logo"
              />
              <h2 className="mt-1 mb-5 pb-1">Admin Login</h2>
            </div>
            <p className="admin-login-text">Please login to your admin account</p>
            <form onSubmit={handleSubmit}>
              <MDBInput
                wrapperClass="mb-4"
                label="Username"
                id="adminUsername"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                required
                className="admin-login-input"
              />
              <MDBInput
                wrapperClass="mb-4"
                label="Password"
                id="adminPassword"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="admin-login-input"
              />
              <div className="text-center pt-1 mb-5 pb-1">
                <MDBBtn type="submit" className="mb-4 w-100 admin-login-gradient-custom">
                  Sign in
                </MDBBtn>
              </div>
            </form>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>
    </MDBContainer>
  );
};

export default AdminLogin;
