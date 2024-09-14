import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Resetpassword.css"

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showResendLink, setShowResendLink] = useState(false); // To show resend link option
  const query = new URLSearchParams(window.location.search);
  const token = query.get("token"); // Get token from the URL
  const type = query.get("type");   // Get user type from the URL (sp or client)

  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      const response = await axios.post(`http://localhost:3000/resetpassword`, { password, token, type });

      if (response.data.message === "Token is invalid or has expired") {
        setErrorMessage("Token is invalid or has expired. Do you want to resend the link?");
        setShowResendLink(true);  // Show the option to resend the link
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
    <>
      <div className="reset-password-container">
        <div className="reset-password-header">
          <h2>Reset Password</h2>
        </div>
        <form className="reset-password-form" onSubmit={handleResetPassword}>
          <div className="input-field">
            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-field">
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="reset-password-button"
          >
            Reset Password
          </button>
        </form>

        {errorMessage && <p className="error-message">{errorMessage}</p>}

        {showResendLink && (
          <div className="resend-link">
            <button onClick={handleResendLink}>Resend Password Reset Link</button>
          </div>
        )}
      </div>
    </>
  );
};

export default ResetPassword;
