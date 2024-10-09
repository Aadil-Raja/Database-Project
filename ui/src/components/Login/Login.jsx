import React, { useState } from "react";
import axios from 'axios';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBCard,
  MDBCardBody,
  MDBCardImage
} from 'mdb-react-ui-kit';
import { Link, useNavigate } from "react-router-dom";
import "./Login.css"; // For any additional styling if needed

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const emailHandler = (e) => setEmail(e.target.value);
  const passwordHandler = (e) => setPassword(e.target.value);

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post("http://localhost:3000/login", { email, password });
      console.log(response);
     
      if (response.data.message === "exist") {
        console.log("Login successful!");
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user_ID', response.data.user_ID);
        localStorage.setItem('usertype', response.data.role);    

        if (response.data.first_time_login === "First time login") {
          navigate("/service-provider-form");
        } else if (response.data.role === "serviceproviders") {
          navigate("/ServiceProviderHome");
        } else if (response.data.role === "clients") {
          navigate("/About");
        }
      } else if (response.data === "notexist") {
        alert("Signup First");
      } else if (response.data.message === "Invalid password") {
        alert("Invalid Password!");
      } else {
        alert("Failed to login");
      }
    } catch (err) {
      alert("Failed to login");
      console.error('Error during login:', err);
    }
  };

  return (
    <MDBContainer fluid className='d-flex align-items-center justify-content-center bg-image' >
      <MDBRow className="w-100 justify-content-center">
        <MDBCol xl="30" lg="30
        " md="9" sm="5" className='mb-5'>
          <MDBCard className='m-5' style={{ width : '450px',padding: '20px', zIndex: 1 }}>
            <MDBCardBody className='px-5'>
              <div className="text-center">
                <MDBCardImage 
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/lotus.webp"
                  style={{ width: '185px' }} 
                  alt="logo" 
                />
                <h4 className="mt-1 mb-5 pb-1">Kaam karo</h4>
              </div>
              <p>Please login to your account</p>
              <form onSubmit={handleLogin}>
                <MDBInput 
                  wrapperClass='mb-4' 
                  label='Email address' 
                  id='form1' 
                  type='email' 
                  value={email} 
                  onChange={emailHandler} 
                  required
                />
                <MDBInput 
                  wrapperClass='mb-4' 
                  label='Password' 
                  id='form2' 
                  type='password' 
                  value={password} 
                  onChange={passwordHandler} 
                  required
                />
                <div className="text-center pt-1 mb-5 pb-1">
                  <MDBBtn type="submit" className="mb-4 w-100 login-gradient-custom-2">Sign in</MDBBtn>
                  <Link to="/forgotpassword" className="text-muted">Forgot password?</Link>
                </div>
              </form>
              <div className="d-flex flex-row align-items-center justify-content-center pb-4 mb-4">
                <p className="mb-0">Don't have an account?</p>
                <Link to="/register">
                  <MDBBtn outline className='mx-2' color='danger'>
                    Create new
                  </MDBBtn>
                </Link>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

       
      </MDBRow>
    </MDBContainer>
  );
};

export default Login;
