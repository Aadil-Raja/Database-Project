import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";  
import "./register.css";
import serviceProviderImage from "./service provider.png"; 
import clientImage from "./client.jpg";

export default function Register() {
    const [selectedRole, setSelectedRole] = useState("");
    const navigate = useNavigate();
    
    const handleSelectRole = (role) => {
        setSelectedRole(role);
    };

    const handleCreateAccount = () => {
        navigate(selectedRole === "serviceProvider" ? "/sp" : "/client", {
            state: { role: selectedRole },
        });
    };

    return (
        <div className="register-body">
            <div className="register-container">
                <h1 className="register-h1">Join as a Client or a Service Provider</h1>
                <div className="register-options">
                    <div
                        className={`register-option ${selectedRole === "client" ? "selected" : ""}`}
                        onClick={() => handleSelectRole("client")}
                    >
                        <input
                            type="radio"
                            id="client"
                            name="role"
                            checked={selectedRole === "client"}
                            readOnly
                        />
                        <label htmlFor="client">
                            <div className="icon">
                                <img
                                    src={clientImage}
                                    alt="Client"
                                    className="register-client-img"
                                />
                            </div>
                            <p>I'm a client, hiring for a project</p>
                        </label>
                    </div>
                    <div
                        className={`register-option ${selectedRole === "serviceProvider" ? "selected" : ""}`}
                        onClick={() => handleSelectRole("serviceProvider")}
                    >
                        <input
                            type="radio"
                            id="serviceProvider"
                            name="role"
                            checked={selectedRole === "serviceProvider"}
                            readOnly
                        />
                        <label htmlFor="serviceProvider">
                            <div className="icon">
                                <img
                                    src={serviceProviderImage}
                                    alt="Service Provider"
                                    className="register-service-provider-img"
                                />
                            </div>
                            <p>I'm a Service Provider, looking for work</p>
                        </label>
                    </div>
                </div>
                {selectedRole && (
                    <button className="register-create-account" onClick={handleCreateAccount}>
                        Create Account
                    </button>
                )}
                <Outlet /> 
                <p className="register-login">Already have an account? <a href="/login">Log In</a></p>
            </div>
        </div>
    );
}
