import React from 'react';
import {useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
function Forgotpassword()
{
    const [email,setEmail]=useState("");
    const navigate = useNavigate();
    const handleEmail =(e)=>
    {
        setEmail(e.target.value)
    }
   
    const handleReset = async (e)=>
    {
        e.preventDefault();  e.preventDefault();
        
        try {
          const response = await axios.post("http://localhost:3000/forgotpassword", { email });
          if (response.data.message === "Password reset link sent") {
            // Store the email in localStorage for later use (e.g., when resending the reset link)
            localStorage.setItem("resetEmail", email);
            alert("Password reset link has been sent to your email.");
          } 
          else if (response.data.message==="Email not found")
          {
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
    return(
    <div>
        <h1>Forgot Password</h1>
        <form>
            <input 
                type="email" 
                placeholder="Enter your email" 
                onChange={handleEmail} 
                required 
            />
           <br/>
           <br/>
          
            <br/>
            <button type="submit"  onClick={handleReset}>Send Reset Password Link</button>

        </form>
       
    </div>
);
        
}
export default Forgotpassword;