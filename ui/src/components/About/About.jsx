import React from "react";
import { MDBRow, MDBCol, MDBBtn, MDBIcon,MDBRipple } from "mdb-react-ui-kit";
import "./About.css"; // Assuming custom styles are added here

export default function About() {
  return (
    <div className="about-section">
      <MDBRow className="align-items-center">
        <MDBCol md="6">
        <MDBRipple rippleTag='div' className='bg-image hover-overlay hover-zoom hover-shadow'>
          <img
            src="https://tailus.io/sources/blocks/left-image/preview/images/startup.png"
            alt="About Us"
            className="about-image img-fluid"
          />
          <div className='mask' style={{ backgroundColor: 'rgba(0,128,128,0.2)' }}></div>
          </MDBRipple>
        </MDBCol>
        <MDBCol md="6" className="about-text">
          <h2 className="about-title">
            Empowering Service Providers for a Better Tomorrow
          </h2>
          <p className="about-description">
            Our platform connects you with skilled professionals who are ready
            to offer their expertise. Whether you need assistance with home
            services or business solutions, we aim to make it easier for you to
            find the right service provider.
          </p>
          <p className="about-mission">
            We believe in the power of collaboration, and through our platform,
            we help service providers and users connect seamlessly to achieve
            mutual goals. Join us in building a future where expert services are
            always just a click away.
          </p>
          <MDBBtn color="info" size="lg" className="about-btn">
            Learn More
            <MDBIcon fas icon="arrow-right ms-2" />
          </MDBBtn>
        </MDBCol>
      </MDBRow>
    </div>
  );
}
