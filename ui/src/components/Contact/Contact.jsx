import React from "react";
import { MDBRow, MDBCol, MDBBtn, MDBIcon, MDBInput } from "mdb-react-ui-kit";
import "./Contact.css"; // Custom styles if needed

export default function Contact() {
  return (
    <div className="contact-section py-5">
      <MDBCol className="justify-content-center">
        <MDBRow md="6" className="p-4 contact-firstrow">
          <h1 className="text-3xl font-bold text-center mb-4">Get in Touch</h1>
          <p className="text-center mb-4">
            Fill in the form to start a conversation
          </p>

          <div className="mb-4 d-flex align-items-center">
            <MDBIcon fas icon="map-marker-alt" className="me-2 text-muted" size="lg" />
            <span>Acme Inc, Street, State, Postal Code</span>
          </div>

          <div className="mb-4 d-flex align-items-center">
            <MDBIcon fas icon="phone" className="me-2 text-muted" size="lg" />
            <span>+44 1234567890</span>
          </div>

          <div className="mb-4 d-flex align-items-center">
            <MDBIcon fas icon="envelope" className="me-2 text-muted" size="lg" />
            <span>info@acme.org</span>
          </div>
        </MDBRow>

        <MDBRow md="6" className="p-4">
          <form>
            <MDBInput
              label="Full Name"
              id="name"
              type="text"
              className="mb-4"
              required
            />
            <MDBInput
              label="Email"
              id="email"
              type="email"
              className="mb-4"
              required
            />
            <MDBInput
              label="Telephone Number"
              id="tel"
              type="tel"
              className="mb-4"
              required
            />

            <MDBBtn color="info" type="submit" className="w-100">
              Submit
              <MDBIcon fas icon="paper-plane ms-2" />
            </MDBBtn>
          </form>
        </MDBRow>
      </MDBCol>
    </div>
  );
}
