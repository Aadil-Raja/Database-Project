import React, { useState, useEffect } from "react";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBCarousel,
  MDBCarouselItem,
} from "mdb-react-ui-kit";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Home.css";

export default function Home() {
  const [categories, setCategories] = useState([]);
  const BASE_URL = import.meta.env.VITE_BACKEND_URL ;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/categories`);
        setCategories(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]); // Fallback in case of error
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="home-section">
      {/* Banner Section */}
      <MDBContainer fluid className="text-center text-lg-start d-flex align-items-center home-banner">
        <MDBCarousel showIndicators className="w-100 h-100">
          <MDBCarouselItem itemId={1}>
            <img
              src={`${BASE_URL}/images/home-main-1.jpg`}
              className="carousel-image"
              alt="Slide 1"
            />
          </MDBCarouselItem>
          <MDBCarouselItem itemId={2}>
            <img
              src={`${BASE_URL}/images/home-main-2.jpg`}
              className="carousel-image"
              alt="Slide 2"
            />
          </MDBCarouselItem>
          <MDBCarouselItem itemId={3}>
            <img
              src={`${BASE_URL}/images/home-main-3.jpg`}
              className="carousel-image"
              alt="Slide 3"
            />
          </MDBCarouselItem>
        </MDBCarousel>

        <div className="home-overlay"></div>
        <MDBRow className="text-overlay">
          <MDBCol lg="12">
            <h1 className="home-heading">Find Top Services for Every Task</h1>
            <p className="lead">
              Connecting you with top professionals across various fields for efficient, reliable work.
            </p>
            <div className="home-buttons">
              <MDBBtn outline color="light" size="lg" className="ms-3">
                <Link to="/Register" className="btn-link">
                  Register Now
                </Link>
              </MDBBtn>
            </div>
          </MDBCol>
        </MDBRow>
      </MDBContainer>

      {/* Services Section */}
      <MDBContainer className="services-section py-5">
        <h2 className="text-center mb-5">Explore Our Services</h2>
        <MDBRow className="text-center">
          {categories.length > 0 ? (
            categories
              .filter((category) => category.status === "active")
              .map((category) => (
                <MDBCol key={category.category_id} md="6" lg="4" className="mb-4">
                  <Link to={`/categories/${category.category_id}`} className="service-link">
                    <MDBCard className="service-card shadow-sm p-3 rounded">
                      <MDBCardBody>
                        <div className="service-icon-wrapper">
                          <img
                            src={`${BASE_URL}/images/${category.name.toLowerCase().replace(/ /g, "-")}.png`}
                            alt={category.name}
                            className="service-icon"
                          />
                        </div>
                        <h5 className="service-name mt-3">{category.name}</h5>
                        <p className="service-description mt-2">{category.description}</p>
                      </MDBCardBody>
                    </MDBCard>
                  </Link>
                </MDBCol>
              ))
          ) : (
            <p>No services available at the moment. Please check back later!</p>
          )}
        </MDBRow>
      </MDBContainer>

      {/* Benefits Section */}
      <MDBContainer className="benefits-section py-5">
        <h2 className="text-center mb-5">Why Choose Us?</h2>
        <MDBRow className="text-center">
          <MDBCol md="4">
            <MDBIcon fas icon="clock" size="3x" className="benefit-icon mb-3" />
            <h5>Time-Saving</h5>
            <p>Get tasks done quickly by hiring experts in seconds.</p>
          </MDBCol>
          <MDBCol md="4">
            <MDBIcon fas icon="wallet" size="3x" className="benefit-icon mb-3" />
            <h5>Cost-Effective</h5>
            <p>Choose professionals that fit your budget and quality standards.</p>
          </MDBCol>
          <MDBCol md="4">
            <MDBIcon fas icon="star" size="3x" className="benefit-icon mb-3" />
            <h5>Top Quality</h5>
            <p>Work with highly-rated experts with proven track records.</p>
          </MDBCol>
        </MDBRow>
      </MDBContainer>

      {/* How It Works Section */}
      <MDBContainer className="how-it-works-section py-5">
        <h2 className="text-center mb-5">How It Works</h2>
        <MDBRow className="text-center">
          <MDBCol md="4">
            <MDBIcon fas icon="search" size="3x" className="mb-3" />
            <h5>Search for Services</h5>
            <p>Browse through various categories and select the service you need.</p>
          </MDBCol>
          <MDBCol md="4">
            <MDBIcon fas icon="handshake" size="3x" className="mb-3" />
            <h5>Hire the Right Professional</h5>
            <p>Connect with the best freelancers who match your requirements.</p>
          </MDBCol>
          <MDBCol md="4">
            <MDBIcon fas icon="thumbs-up" size="3x" className="mb-3" />
            <h5>Get the Job Done</h5>
            <p>Work efficiently and receive high-quality deliverables on time.</p>
          </MDBCol>
        </MDBRow>
      </MDBContainer>

      {/* Testimonials Section */}
      <MDBContainer className="testimonials-section py-5">
        <h2 className="text-center mb-5">What Our Users Say</h2>
        <MDBRow className="text-center">
          <MDBCol md="4">
            <MDBCard className="testimonial-card">
              <MDBCardBody>
                <p>"The platform made it so easy to find a great developer for my project."</p>
                <h6>- Jane Doe, Entrepreneur</h6>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol md="4">
            <MDBCard className="testimonial-card">
              <MDBCardBody>
                <p>"Excellent service! I found a designer who understood my vision perfectly."</p>
                <h6>- John Smith, Startup Owner</h6>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol md="4">
            <MDBCard className="testimonial-card">
              <MDBCardBody>
                <p>"The best platform for hiring freelancers. Highly recommend it!"</p>
                <h6>- Sarah Lee, Marketer</h6>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>

      {/* Featured Service Providers Section */}
      <MDBContainer className="featured-section py-5">
        <h2 className="text-center mb-5">Meet Our Top Service Providers</h2>
        <MDBRow className="text-center">
          <MDBCol md="3">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(1).jpg"
              alt="Provider"
              className="featured-img rounded-circle"
            />
            <h6 className="mt-3">Alex Johnson</h6>
            <p>Web Developer</p>
          </MDBCol>
          <MDBCol md="3">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(2).jpg"
              alt="Provider"
              className="featured-img rounded-circle"
            />
            <h6 className="mt-3">Emily Davis</h6>
            <p>Graphic Designer</p>
          </MDBCol>
          <MDBCol md="3">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(3).jpg"
              alt="Provider"
              className="featured-img rounded-circle"
            />
            <h6 className="mt-3">Michael Brown</h6>
            <p>SEO Specialist</p>
          </MDBCol>
          <MDBCol md="3">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img%20(4).jpg"
              alt="Provider"
              className="featured-img rounded-circle"
            />
            <h6 className="mt-3">Jessica White</h6>
            <p>Content Writer</p>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}
