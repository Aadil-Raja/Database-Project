import React, { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import "./register.css";
import serviceProviderImage from "./service provider.png"; 
import clientImage from "./client.jpg";

export default function Register() {
    const [selectedRole, setSelectedRole] = useState("");

    const handleSelectRole = (role) => {
        setSelectedRole(role);
    };

    return (
        <div className="container">
            <h1>Join as a Client or a Service Provider</h1>
            <div className="options">
                <div
                    className={`option ${selectedRole === "client" ? "selected" : ""}`}
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
                                className="client-img"
                            />
                        </div>
                        <p>I'm a client, hiring for a project</p>
                    </label>
                </div>
                <div
                    className={`option ${selectedRole === "serviceProvider" ? "selected" : ""}`}
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
                                className="service-provider-img"
                            />
                        </div>
                        <p>I'm a Service Provider, looking for work</p>
                    </label>
                </div>
            </div>
            {selectedRole && (
                <NavLink to={selectedRole === "serviceProvider" ? "/sp" : "/client"}>
                    <button className="create-account">
                        Create Account
                    </button>
                </NavLink>
            )}
            <Outlet /> 
            <p className="login">Already have an account? <a href="/login">Log In</a></p>
        </div>
    );
}
