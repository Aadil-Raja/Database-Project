// Categories.jsx

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
} from "mdb-react-ui-kit";
import "./categories.css"; // Import custom CSS for additional styling

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const BASE_URL = import.meta.env.VITE_BACKEND_URL ;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/categories`);
        setCategories(response.data);
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error("Error fetching categories:", error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <MDBContainer fluid className="my-5 categories-body">
      <h2 className="text-center mt-4 mb-5">
        <strong>Our Service Categories</strong>
      </h2>

      {loading ? (
        // Show a spinner while loading
        <div className="text-center">
          <MDBSpinner grow size="lg" role="status" className="mb-3">
            <span className="visually-hidden">Loading...</span>
          </MDBSpinner>
          <p>Loading categories...</p>
        </div>
      ) : (
        <MDBRow className="g-4 mt-6 space-y-12 lg:space-y-0">
          {categories
            .filter((category) => category.status === "active")
            .map((category) => (
              <MDBCol key={category.category_id} md="6" lg="4" className="mb-4">
                <Link to={`/Categories/${category.category_id}`} className="category-link">
                  <MDBCard className="h-100 category-card shadow-sm p-3 rounded hover-shadow">
                    <div className="category-icon-wrapper">
                      <MDBCardImage
                        src={`${BASE_URL}/images/${category.name
                          .toLowerCase()
                          .replace(/ /g, "-")}.png`}
                        alt={category.name}
                        position="top"
                        className="category-icon"
                      />
                    </div>
                    <MDBCardBody>
                      <MDBCardTitle className="category-name mt-3">{category.name}</MDBCardTitle>
                      <MDBCardText className="category-description mt-2">
                        {category.description}
                      </MDBCardText>
                    </MDBCardBody>
                  </MDBCard>
                </Link>
              </MDBCol>
            ))}
        </MDBRow>
      )}
    </MDBContainer>
  );
}
