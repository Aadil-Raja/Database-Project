import React from 'react';
import { MDBFooter, MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdb-react-ui-kit';
import './Footer.css'
export default function App() {
  return (
    <MDBFooter bgColor='black' className='text-center text-lg-start text-muted main-footer'>
      <section className='d-flex justify-content-center justify-content-lg-between p-4 ' style={{ borderColor: 'black' }}>
        <div className='me-5 d-none d-lg-block'>
          <span>Get connected with us on social networks:</span>
        </div>

        <div className='hover-icons'>
          <a href='' className='me-4 text-reset icons' style={{ color: 'white' }}>
            <MDBIcon fab icon="facebook-f" />
          </a>
          <a href='' className='me-4 text-reset' style={{ color: 'white' }}>
            <MDBIcon fab icon="twitter" />
          </a>
          <a href='' className='me-4 text-reset' style={{ color: 'white' }}>
            <MDBIcon fab icon="google" />
          </a>
          <a href='' className='me-4 text-reset' style={{ color: 'white' }}>
            <MDBIcon fab icon="instagram" />
          </a>
          <a href='' className='me-4 text-reset' style={{ color: 'white' }}>
            <MDBIcon fab icon="linkedin" />
          </a>
          <a href='' className='me-4 text-reset' style={{ color: 'white' }}>
            <MDBIcon fab icon="github" />
          </a>
        </div>
      </section>

      <section className=''>
        <MDBContainer className='text-center text-md-start mt-5'>
          <MDBRow className='mt-3'>
            <MDBCol md="3" lg="4" xl="3" className='mx-auto mb-4'>
              <h6 className='text-uppercase fw-bold mb-4' style={{ color: 'white' }}>
                <MDBIcon icon="gem" className="me-3" />
                Company name
              </h6>
              <p>
                Here you can use rows and columns to organize your footer content. Lorem ipsum dolor sit amet,
                consectetur adipisicing elit.
              </p>
            </MDBCol>
            
            <MDBCol md="2" lg="2" xl="2" className='mx-auto mb-4'>
              <h6 className='text-uppercase fw-bold mb-4' style={{ color: 'white' }}>Products</h6>
              <p>
                <a href='#!' className='text-reset'>
                  Angular
                </a>
              </p>
              <p>
                <a href='#!' className='text-reset'>
                  React
                </a>
              </p>
              <p>
                <a href='#!' className='text-reset'>
                  Vue
                </a>
              </p>
              <p>
                <a href='#!' className='text-reset'>
                  Laravel
                </a>
              </p>
            </MDBCol>

            <MDBCol md="3" lg="2" xl="2" className='mx-auto mb-4'>
              <h6 className='text-uppercase fw-bold mb-4' style={{ color: 'white' }}>Useful links</h6>
              <p>
                <a href='#!' className='text-reset' style={{ color: 'white' }}>
                  Pricing
                </a>
              </p>
              <p>
                <a href='#!' className='text-reset' style={{ color: 'white' }}>
                  Settings
                </a>
              </p>
              <p>
                <a href='#!' className='text-reset' style={{ color: 'white' }}>
                  Orders
                </a>
              </p>
              <p>
                <a href='#!' className='text-reset' style={{ color: 'white' }}>
                  Help
                </a>
              </p>
            </MDBCol>

            <MDBCol md="4" lg="3" xl="3" className='mx-auto mb-md-0 mb-4'>
              <h6 className='text-uppercase fw-bold mb-4' style={{ color: 'white' }}>Contact</h6>
              <p>
                <MDBIcon icon="home" className="me-2" />
                New York, NY 10012, US
              </p>
              <p>
                <MDBIcon icon="envelope" className="me-3" />
                info@example.com
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

      <div className='text-center p-4 ' style={{ backgroundColor: 'black', color: 'white' }}>
        © 2021 Copyright:
        <a className='text-reset fw-bold' href='https://mdbootstrap.com/' style={{ color: 'white' }}>
          MDBootstrap.com
        </a>
      </div>
    </MDBFooter>
  );
}
