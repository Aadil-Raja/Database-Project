// Footer.jsx
import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      {/* Top Section with Contact Information */}
      <div className="footer-top">
        <div className="footer-contact-item">
          <div className="footer-icon">
            {/* Phone Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="#fff"
              viewBox="0 0 16 16"
            >
              <path d="M3.654 1.328a.678.678 0 00-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 004.168 6.608 17.6 17.6 0 006.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 00-.063-1.015l-2.307-1.794a.68.68 0 00-.58-.122l-2.19.547a1.75 1.75 0 01-1.657-.459L5.482 8.062a1.75 1.75 0 01-.46-1.657l.548-2.19a.68.68 0 00-.122-.58z" />
            </svg>
          </div>
          <div className="footer-text">
            <span>(+00) 1234 5678</span>
          </div>
        </div>

        <div className="footer-contact-item">
          <div className="footer-icon">
            {/* Email Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="#fff"
              viewBox="0 0 16 16"
            >
              <path d="M0 4a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H2a2 2 0 01-2-2V4zm2-1a1 1 0 00-1 1v.217l7 4.2 7-4.2V4a1 1 0 00-1-1H2zm13 2.383l-4.708 2.825L15 11.105V5.383zM1 5.383v5.722l4.708-2.897L1 5.383z" />
            </svg>
          </div>
          <div className="footer-text">
            <span>info@example.com</span>
          </div>
        </div>

        <div className="footer-contact-item">
          <div className="footer-icon">
            {/* Location Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="#fff"
              viewBox="0 0 16 16"
            >
              <path d="M8 0a5.53 5.53 0 00-5.53 5.53c0 3.04 5.53 9.47 5.53 9.47s5.53-6.43 5.53-9.47A5.53 5.53 0 008 0zm0 8.3a2.77 2.77 0 110-5.53 2.77 2.77 0 010 5.53z" />
            </svg>
          </div>
          <div className="footer-text">
            <span>Fast NUCES University, Karachi</span>
          </div>
        </div>
      </div>

      {/* Middle Section with Links and Subscription */}
      <div className="footer-middle">
        <div className="footer-links-section">
          <h2>About</h2>
          <ul>
            <li>
              <a href="#">Our Story</a>
            </li>
            <li>
              <a href="#">Awards</a>
            </li>
            <li>
              <a href="#">Our Team</a>
            </li>
            <li>
              <a href="#">Career</a>
            </li>
          </ul>
        </div>

        <div className="footer-links-section">
          <h2>Company</h2>
          <ul>
            <li>
              <a href="#">Our Services</a>
            </li>
            <li>
              <a href="#">Clients</a>
            </li>
            <li>
              <a href="#">Contact</a>
            </li>
            <li>
              <a href="#">Press</a>
            </li>
          </ul>
        </div>

        <div className="footer-subscribe">
          <h2>Subscribe</h2>
          <form>
            <input type="email" placeholder="Enter email address" />
            <button type="submit">Subscribe</button>
          </form>
          <span className="subheading">
            Get digital marketing updates in your mailbox
          </span>
        </div>
      </div>

      {/* Bottom Section with Social Media Links */}
      <div className="footer-bottom">
        <p>&copy; 2024 All rights reserved</p>
        <div className="footer-social">
          <a href="#" title="Twitter">
            {/* Twitter Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="#fff"
              viewBox="0 0 16 16"
            >
              <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.28-.008-.42A6.673 6.673 0 0016 3.542a6.658 6.658 0 01-1.889.518 3.301 3.301 0 001.447-1.817 6.533 6.533 0 01-2.084.797A3.286 3.286 0 007.875 5.03a9.325 9.325 0 01-6.766-3.429 3.289 3.289 0 001.017 4.381A3.323 3.323 0 01.64 6.575v.045a3.288 3.288 0 002.632 3.218 3.203 3.203 0 01-.865.114 3.23 3.23 0 01-.614-.057 3.288 3.288 0 003.067 2.28A6.588 6.588 0 010 13.58a9.29 9.29 0 005.031 1.475" />
            </svg>
          </a>
          <a href="#" title="Facebook">
            {/* Facebook Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="#fff"
              viewBox="0 0 16 16"
            >
              <path d="M8.942 8.049H7.342v5.625H5.312V8.049H4.032V6.275h1.28V5.225c0-1.284.783-2.033 1.925-2.033.544 0 1.012.04 1.148.058v1.328h-.788c-.617 0-.737.293-.737.724v.952h1.475l-.192 1.774z" />
            </svg>
          </a>
          <a href="#" title="Instagram">
            {/* Instagram Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="#fff"
              viewBox="0 0 16 16"
            >
              <path d="M8 0c1.65 0 1.853.006 2.503.036.651.03 1.092.132 1.48.278a3.367 3.367 0 011.182.764 3.367 3.367 0 01.764 1.182c.146.388.248.829.278 1.48.03.65.036.853.036 2.503s-.006 1.853-.036 2.503c-.03.651-.132 1.092-.278 1.48a3.367 3.367 0 01-.764 1.182 3.367 3.367 0 01-1.182.764c-.388.146-.829.248-1.48.278-.65.03-.853.036-2.503.036s-1.853-.006-2.503-.036c-.651-.03-1.092-.132-1.48-.278a3.367 3.367 0 01-1.182-.764 3.367 3.367 0 01-.764-1.182c-.146-.388-.248-.829-.278-1.48C.006 9.853 0 9.65 0 8s.006-1.853.036-2.503c.03-.651.132-1.092.278-1.48a3.367 3.367 0 01.764-1.182A3.367 3.367 0 012.26.314C2.648.168 3.089.066 3.74.036 4.39.006 4.593 0 6.243 0h1.513zm0 1.513H6.243c-1.597 0-1.796.006-2.429.036-.597.029-.925.126-1.14.21-.285.11-.487.243-.7.456-.212.212-.345.414-.456.7-.084.214-.181.543-.21 1.14-.03.633-.036.832-.036 2.429v1.513c0 1.597.006 1.796.036 2.429.029.597.126.925.21 1.14.11.285.243.487.456.7.212.212.414.345.7.456.214.084.543.181 1.14.21.633.03.832.036 2.429.036h1.513c1.597 0 1.796-.006 2.429-.036.597-.029.925-.126 1.14-.21.285-.11.487-.243.7-.456.212-.212.345-.414.456-.7.084-.214.181-.543.21-1.14.03-.633.036-.832.036-2.429V6.243c0-1.597-.006-1.796-.036-2.429-.029-.597-.126-.925-.21-1.14-.11-.285-.243-.487-.456-.7a2.85 2.85 0 00-.7-.456c-.214-.084-.543-.181-1.14-.21C9.796.006 9.597 0 8 0zM8 3.888a4.112 4.112 0 110 8.224 4.112 4.112 0 010-8.224zm0 1.513a2.599 2.599 0 100 5.198 2.599 2.599 0 000-5.198zm3.406-.897a.96.96 0 110 1.92.96.96 0 010-1.92z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
