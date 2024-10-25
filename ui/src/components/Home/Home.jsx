import React, { useState, useEffect } from "react";
import { MDBContainer, MDBRow, MDBCol, MDBBtn, MDBCard, MDBCardBody, MDBIcon } from 'mdb-react-ui-kit';
import './Home.css';
import { Link } from 'react-router-dom';


export default function Home() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:3000/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);
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

      {/* Services Section */}
      <MDBContainer className='services-section py-5'>
        <h2 className='text-center mb-4'>Services Offered</h2>
        <MDBRow className='text-center'>
          {categories
            .filter((category) => category.status === 'active')
            .map((category) => (
              <MDBCol key={category.category_id} md="6" lg="4" className="mb-4">
                <Link to={`/categories/${category.category_id}`} className="service-link">
                  <MDBCard className='service-card shadow-sm p-3 rounded'>
                    <MDBCardBody>
                      <div className="service-icon-wrapper">
                        <img
                          src={`http://localhost:3000/images/${category.name
                            .toLowerCase()
                            .replace(/ /g, "-")}.png`}
                          alt={category.name}
                          className="service-icon"
                        />
                      </div>
                      <h5 className='service-name mt-3'>{category.name}</h5>
                      <p className='service-description mt-2'>{category.description}</p>
                    </MDBCardBody>
                  </MDBCard>
                </Link>
              </MDBCol>
            ))}
        </MDBRow>
      </MDBContainer>


      {/* How It Works Section */}
      <MDBContainer className='how-it-works-section py-5'>
        <h2 className='text-center mb-4'>How It Works</h2>
        <MDBRow className='text-center'>
          <MDBCol md="4">
            <MDBIcon fas icon="search" size="3x" className='mb-3' />
            <h5>Search for Services</h5>
            <p>Browse through various categories and select the service you need.</p>
          </MDBCol>
          <MDBCol md="4">
            <MDBIcon fas icon="handshake" size="3x" className='mb-3' />
            <h5>Hire the Right Professional</h5>
            <p>Connect with the best freelancers who match your requirements.</p>
          </MDBCol>
          <MDBCol md="4">
            <MDBIcon fas icon="thumbs-up" size="3x" className='mb-3' />
            <h5>Get the Job Done</h5>
            <p>Work efficiently and receive high-quality deliverables on time.</p>
          </MDBCol>
        </MDBRow>
      </MDBContainer>

      {/* Testimonials Section */}
      <MDBContainer className='testimonials-section py-5'>
        <h2 className='text-center mb-4'>What Our Users Say</h2>
        <MDBRow className='text-center'>
          <MDBCol md="4">
            <MDBCard className='testimonial-card'>
              <MDBCardBody>
                <p>"The platform made it so easy to find a great developer for my project."</p>
                <h6>- Jane Doe, Entrepreneur</h6>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol md="4">
            <MDBCard className='testimonial-card'>
              <MDBCardBody>
                <p>"Excellent service! I found a designer who understood my vision perfectly."</p>
                <h6>- John Smith, Startup Owner</h6>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol md="4">
            <MDBCard className='testimonial-card'>
              <MDBCardBody>
                <p>"The best platform for hiring freelancers. Highly recommend it!"</p>
                <h6>- Sarah Lee, Marketer</h6>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>

      {/* Featured Service Providers Section */}
      <MDBContainer className='featured-section py-5'>
        <h2 className='text-center mb-4'>Featured Service Providers</h2>
        <MDBRow className='text-center'>
          <MDBCol md="3">
            <img src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(1).jpg" alt="Provider" className='featured-img rounded-circle' />
            <h6 className='mt-3'>Alex Johnson</h6>
            <p>Web Developer</p>
          </MDBCol>
          <MDBCol md="3">
            <img src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(2).jpg" alt="Provider" className='featured-img rounded-circle' />
            <h6 className='mt-3'>Emily Davis</h6>
            <p>Graphic Designer</p>
          </MDBCol>
          <MDBCol md="3">
            <img src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(3).jpg" alt="Provider" className='featured-img rounded-circle' />
            <h6 className='mt-3'>Michael Brown</h6>
            <p>SEO Specialist</p>
          </MDBCol>
          <MDBCol md="3">
            <img src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(4).jpg" alt="Provider" className='featured-img rounded-circle' />
            <h6 className='mt-3'>Jessica White</h6>
            <p>Content Writer</p>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}
