// CategoryDetails.jsx

import React, { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import axios from "axios";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCardTitle,
  MDBCardText,
  MDBSpinner,
  MDBBreadcrumb,
  MDBBreadcrumbItem,
} from "mdb-react-ui-kit";
import "./categoryDetails.css"; // Import custom CSS for additional styling

export default function CategoryDetails() {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      try {
        const categoryResponse = await axios.get(`http://localhost:3000/categories/${categoryId}`);
        setCategory(categoryResponse.data);

        const servicesResponse = await axios.get(`http://localhost:3000/services/${categoryId}`);
        setServices(servicesResponse.data);
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error("Error fetching category or services:", error);
        setLoading(false);
      }
    };

    fetchCategoryDetails();
  }, [categoryId]);

  if (loading) {
    return (
      <div className="text-center my-5">
        <MDBSpinner grow size="lg" role="status" className="mb-3">
          <span className="visually-hidden">Loading...</span>
        </MDBSpinner>
        <p>Loading services...</p>
      </div>
    );
  }

  if (!category) return <p>Category not found.</p>;

  return (
    <MDBContainer fluid className="my-5 services-body">
      {/* Breadcrumb Navigation */}
      <MDBBreadcrumb className="mx-3">
        <MDBBreadcrumbItem>
          <Link to="/Categories">Categories</Link>
        </MDBBreadcrumbItem>
        <MDBBreadcrumbItem active>{category.name}</MDBBreadcrumbItem>
      </MDBBreadcrumb>

      {category.status === "active" && (
        <>
          <h2 className="text-center mt-4 mb-5">
            <strong>{category.name}</strong>
          </h2>
          <p className="text-center text-gray-600 text-lg">{category.description}</p>

          <MDBRow className="g-4 mt-6 space-y-12 lg:space-y-0">
            {services
              .filter((service) => service.status === "active")
              .map((service, index) => (
                <MDBCol key={index} md="6" lg="4" className="mb-4">
                  <Link
                    to={`/Categories/${categoryId}/${service.service_id}/servicerequestform`}
                    className="service-link"
                  >
                    <MDBCard className="h-100 service-card shadow-sm p-3 rounded hover-shadow">
                      <div className="service-icon-wrapper">
                        <MDBCardImage
                          src={`http://localhost:3000/images/${service.name
                            .toLowerCase()
                            .replace(/ /g, "-")}.png`}
                          alt={service.name}
                          position="top"
                          className="service-icon"
                        />
                      </div>
                      <MDBCardBody>
                        <MDBCardTitle className="service-name mt-3">{service.name}</MDBCardTitle>
                        <MDBCardText className="service-description mt-2">{service.description}</MDBCardText>
                      </MDBCardBody>
                    </MDBCard>
                  </Link>
                </MDBCol>
              ))}
          </MDBRow>
        </>
      )}
    </MDBContainer>
  );
}
