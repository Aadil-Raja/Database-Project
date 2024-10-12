import React from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBBtn } from 'mdb-react-ui-kit';
import './Home.css';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className='home-section'>
      <MDBContainer fluid className='text-center text-lg-start d-flex align-items-center home-banner'>
        <MDBRow>
          <MDBCol lg="6" className='home-text'>
            <h1 className='mb-4 home-heading'>
              The Best Talent Available, Right Now and Right Here
            </h1>
            <p className='lead mb-4'>
              Connecting you with top professionals in various services. Get work done easily and efficiently with our trusted service providers.
            </p>
            <div className='home-buttons'>
            <MDBBtn outline color='light' size='lg' className='ms-3'>
              <Link to='/Register'>
              Register Now 
              </Link>
            </MDBBtn>

            </div>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}
