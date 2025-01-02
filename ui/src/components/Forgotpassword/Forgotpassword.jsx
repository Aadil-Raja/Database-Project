import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBIcon
} from 'mdb-react-ui-kit';
import './Forgotpassword.css';

function Forgotpassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

  const handleReset = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${BASE_URL}/forgotpassword`, { email });
      if (response.data.message === "Password reset link sent") {
        localStorage.setItem("resetEmail", email);
        alert("Password reset link has been sent to your email.");
      } else if (response.data.message === "Email not found") {
        alert("Email not exists.");
      } else {
        alert("There was an issue sending the password reset link.");
      }
    } catch (error) {
      console.log("Error sending password reset link:", error);
      alert("An error occurred while sending the password reset link.");
    }
  };

  return (
    <MDBContainer fluid className='forgot-password-page'>
      <MDBRow className='justify-content-center align-items-center h-100'>
        <MDBCol md='6' lg='4'>
          <MDBCard className='forgot-password-card'>
            <MDBCardBody>
              <h3 className='text-center mb-4'>Forgot Password</h3>
              <p className='text-center mb-4'>
                Enter your registered email address and we'll send you a link to reset your password.
              </p>
              <form onSubmit={handleReset}>
                <MDBInput
                  type='email'
                  label='Email address'
                  className='mb-4'
                  onChange={handleEmail}
                  required
                  icon='envelope'
                />
                <div className='text-center'>
                  <MDBBtn type='submit' className='forgot-password-btn' size='lg'>
                    Send Reset Link
                    <MDBIcon fas icon="paper-plane ms-2" />
                  </MDBBtn>
                </div>
              </form>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default Forgotpassword;
