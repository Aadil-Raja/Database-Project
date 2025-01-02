import React from "react";
import { MDBRow, MDBCol, MDBBtn, MDBIcon, MDBRipple, MDBContainer } from "mdb-react-ui-kit";
import "./About.css";

export default function About() {
  const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
  return (
    <MDBContainer fluid className="about-section py-5">
      <MDBRow className="align-items-center mb-5">
        <MDBCol md="6">
          <MDBRipple rippleTag="div" className="bg-image hover-overlay hover-zoom hover-shadow">
            <img
              src={`${BASE_URL}/images/about-1.jpg`}
              alt="About Us"
              className="about-image img-fluid"
            />
            <div className="mask" style={{ backgroundColor: "rgba(0,128,128,0.2)" }}></div>
          </MDBRipple>
        </MDBCol>
        <MDBCol md="6" className="about-text align-items-center justify-content-center">
          <h2 className="about-title">Empowering Service Providers for a Better Tomorrow</h2>
          <p className="about-description">
            Our platform connects you with skilled professionals ready to offer their expertise.We aim to simplify finding the right service provider for your needs.
          </p>
          <p className="about-description">
            With features like real-time chat and request management we bridge the gap between
            clients and providers seamlessly. Whether you're hiring or offering services, we’re here to streamline your
            experience.
          </p>
        </MDBCol>
      </MDBRow>

      {/* Section: How We Serve Clients */}
      <MDBRow className="about-clients-section py-5 align-items-center justify-content-center">
        <MDBCol md="6" className="about-text">
          <h3 className="about-subtitle">How We Serve Clients</h3>
          <p className="about-description">
            For clients, our platform provides a seamless experience to find and hire the best professionals for the job.
            Our user-friendly interface allows you to browse through a diverse range of service providers, request quotes,
            and chat in real-time. Whether you need a electrician, plumber, or home improvement expert, we've
            got you covered.
          </p>
          <p className="about-description">
            Clients also benefit from secure chat system, review systems to evaluate providers, and the ability to track
            their service requests in real-time.
          </p>
        </MDBCol>
        <MDBCol md="6">
          <MDBRipple rippleTag="div" className="bg-image hover-overlay hover-zoom hover-shadow">
            <img
             src={`${BASE_URL}/images/about-2.jpg`}
              alt="Serving Clients"
              className="about-image img-fluid"
            />
            <div className="mask" style={{ backgroundColor: "rgba(0,128,128,0.2)" }}></div>
          </MDBRipple>
        </MDBCol>
      </MDBRow>

      {/* Section: How We Serve Service Providers */}
      <MDBRow className="about-providers-section py-5 align-items-center justify-content-center">
        <MDBCol md="6  order-2 order-md-1">
          <MDBRipple rippleTag="div" className="bg-image hover-overlay hover-zoom hover-shadow">
            <img
              src={`${BASE_URL}/images/about-3.jpg`}
              alt="Serving Providers"
              className="about-image img-fluid"
            />
            <div className="mask" style={{ backgroundColor: "rgba(0,128,128,0.2)" }}></div>
          </MDBRipple>
        </MDBCol>
        <MDBCol md="6" className="about-text order-1 order-md-2">
          <h3 className="about-subtitle">How We Serve Service Providers</h3>
          <p className="about-description">
            For service providers, our platform offers a robust system to showcase your skills and expertise. Create a
            professional profile, display your services, and let clients reach out to you. Our integrated request
            management system ensures that you can manage orders, communicate with clients, and earn loads
            effortlessly.
          </p>
          <p className="about-description">
            Providers can also rely on the platform's review system to build credibility and gain more clients.
          </p>
        </MDBCol>
      </MDBRow>

      {/* Section: Features */}
      <MDBRow className="about-features-section py-5">
        <MDBCol md="12" className="text-center mb-4">
          <h3 className="about-subtitle">Our Features</h3>
        </MDBCol>
        <MDBCol md="4">
          <div className="feature-card">
            <MDBIcon fas icon="comments" size="3x" className="feature-icon" />
            <h5 className="feature-title">Real-Time Chat</h5>
            <p className="feature-description">
              Chat with providers and clients instantly to discuss your requirements.
            </p>
          </div>
        </MDBCol>
        <MDBCol md="4">
          <div className="feature-card">
            <MDBIcon fas icon="tasks" size="3x" className="feature-icon" />
            <h5 className="feature-title">Request Management</h5>
            <p className="feature-description">
              Manage your service requests efficiently with real-time updates and tracking.
            </p>
          </div>
        </MDBCol>
        <MDBCol md="4">
          <div className="feature-card">
            <MDBIcon fas icon="search" size="3x" className="feature-icon" />
            <h5 className="feature-title">Easy Service Finding</h5>
            <p className="feature-description">
              Quickly locate the right service providers from a wide range of categories.
            </p>
          </div>
        </MDBCol>

      </MDBRow>
    </MDBContainer>
  );
}
