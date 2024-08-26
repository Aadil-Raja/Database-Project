import React from "react";
import "./Signup.css";

const SignupForm = () => {
  return (
    <div className="form-container">
      <div className="social-login">
        <button className="social-button apple">Continue with Apple</button>
        <button className="social-button google">Continue as Bilal</button>
      </div>
      <div className="separator">
        <span>or</span>
      </div>
      <form>
        <div className="input-group">
          <input type="text" placeholder="First name" />
          <input type="text" placeholder="Last name" />
        </div>
        <div className="input-field">
          <input type="email" placeholder="Work email address" />
        </div>
        <div className="input-field">
          <input type="password" placeholder="Password (8 or more characters)" />
        </div>
        <div className="input-field">
          <select>
            <option>Pakistan</option>
            {/* Add other countries as needed */}
          </select>
        </div>
        <div className="checkbox-group">
          <input type="checkbox" id="tips" />
          <label htmlFor="tips">Send me emails with tips on how to find talent that fits my needs.</label>
        </div>
        <div className="checkbox-group">
          <input type="checkbox" id="terms" />
          <label htmlFor="terms">
            Yes, I understand and agree to the Upwork Terms of Service, including the <a href="#">User Agreement</a> and <a href="#">Privacy Policy</a>.
          </label>
        </div>
        <button type="submit" className="submit-button">Create my account</button>
      </form>
      <div className="login-link">
        Already have an account? <a href="#">Log In</a>
      </div>
    </div>
  );
};

export default SignupForm;
