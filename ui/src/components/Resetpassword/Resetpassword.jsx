import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
import "./Resetpassword.css";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showResendLink, setShowResendLink] = useState(false); // To show resend link option
  const query = new URLSearchParams(window.location.search);
  const token = query.get("token"); // Get token from the URL
  const type = query.get("type"); 
  const user_id=query.get("user_id")  // Get user type from the URL (sp or client)

  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const response = await axios.post(`http://localhost:3000/resetpassword`, { password, token, type,user_id });

      if (response.data.message === "Token is invalid or has expired") {
        setErrorMessage("Token is invalid or has expired. Do you want to resend the link?");
        setShowResendLink(true);  
      } else if (response.data.message === "Password reset successfully") {
        alert(response.data.message);
        navigate("/Login");  // Navigate to login page
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      setErrorMessage("An error occurred while resetting the password.");
    }
  };

  const handleResendLink = async () => {
    try {
      const response = await axios.post("/forgotpassword", { email: localStorage.getItem('resetEmail') });
      alert("Password reset link has been resent to your email.");
      setShowResendLink(false);  // Hide the resend link option after sending
    } catch (error) {
      console.error("Error resending password reset link:", error);
    }
  };

  return (
    <MDBContainer fluid className='reset-password-page'>
      <MDBRow className='justify-content-center align-items-center h-100'>
        <MDBCol md='15' lg='15'>
          <MDBCard className='reset-password-card'>
            <MDBCardBody>
              <h3 className='text-center mb-4'>Reset Password</h3>
              <form onSubmit={handleResetPassword}>
                <MDBInput
                  type="password"
                  label="New Password"
                  className="mb-4"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  icon="lock"
                />
                <MDBInput
                  type="password"
                  label="Confirm New Password"
                  className="mb-4"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  icon="lock"
                />
                <div className="text-center">
                  <MDBBtn type="submit" className="reset-password-btn" size="lg">
                    Reset Password
                    <MDBIcon fas icon="redo ms-2" />
                  </MDBBtn>
                </div>
              </form>
              {errorMessage && <p className="error-message text-center mt-4">{errorMessage}</p>}
              {showResendLink && (
                <div className="resend-link text-center mt-3">
                  <MDBBtn onClick={handleResendLink} color="info" size="sm">
                    Resend Password Reset Link
                  </MDBBtn>
                </div>
              )}
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default ResetPassword;
