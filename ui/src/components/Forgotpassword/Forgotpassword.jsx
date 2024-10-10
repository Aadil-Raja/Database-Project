import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import "./Forgotpassword.css";

function Forgotpassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const handleEmail = (e) => {
    setEmail(e.target.value)
  }

  const handleReset = async (e) => {
    e.preventDefault(); e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/forgotpassword", { email });
      if (response.data.message === "Password reset link sent") {
        // Store the email in localStorage for later use (e.g., when resending the reset link)
        localStorage.setItem("resetEmail", email);
        alert("Password reset link has been sent to your email.");
      }
      else if (response.data.message === "Email not found") {
        alert("email not exists");
      }
      else {
        alert("There was an issue sending the password reset link.");
      }
    } catch (error) {
      console.log("Error sending password reset link:", error);
      alert("An error occurred while sending the password reset link.");
    }
  }
  return (
    <>
      <div class="forgot-password-container">
        <div class="forgot-password-header">
          <h2>Forgot Password</h2>
        </div>
        <form class="forgot-password-form">
          <div class="forgot-password-input-field">
            <label for="email">Enter your email</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              onChange={handleEmail}
              required
            />
          </div>
          <button
            type="submit"
            class="forgot-password-button"
            onClick={handleReset}
          >
            Send Reset Password Link
          </button>
        </form>
        <div class="forgot-password-signup-link">
        </div>
      </div>
    </>
  );

}
export default Forgotpassword;