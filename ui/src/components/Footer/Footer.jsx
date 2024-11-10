import React from 'react';
import { MDBFooter, MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdb-react-ui-kit';
import './Footer.css';

export default function App() {
  return (
    <MDBFooter bgColor='black' className='text-center text-lg-start text-muted main-footer'>
      <section className='d-flex justify-content-center justify-content-lg-between p-4' style={{ borderColor: 'black' }}>


      </section>

      <section className=''>
        <MDBContainer className='text-center text-md-start mt-5'>
          <MDBRow className='mt-3'>
            <MDBCol md="3" lg="4" xl="3" className='mx-auto mb-4'>
              <h6 className='text-uppercase fw-bold mb-4' style={{ color: 'white' }}>
                <MDBIcon icon="gem" className="me-3" />
                Masla Fix
              </h6>
              <p>
                  Become a part of our team to get ahold of effecient solutions to your daily problems.
              </p>
            </MDBCol>

   

            <MDBCol md="4" lg="3" xl="3" className='mx-auto mb-md-0 mb-4'>
              <h6 className='text-uppercase fw-bold mb-4' style={{ color: 'white' }}>Contact</h6>
              <p>
                <MDBIcon icon="home" className="me-2" />
                 Fast University,Karachi
              </p>
              <p>
                <MDBIcon icon="envelope" className="me-3" />
                maslafix@gmail.com
              </p>
              <p>
                <MDBIcon icon="phone" className="me-3" /> + 01 234 567 88
              </p>
              <p>
                <MDBIcon icon="print" className="me-3" /> + 01 234 567 89
              </p>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>

      <div className='text-center p-4' style={{ backgroundColor: 'black', color: 'white' }}>
        © 2024 Copyright:
        <a className='footer-text-reset fw-bold' href='dadd' style={{ color: 'white' }}>
          Maslafix.com
        </a>
      </div>
    </MDBFooter>
  );
}
