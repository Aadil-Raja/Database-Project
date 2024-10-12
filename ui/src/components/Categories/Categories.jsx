import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { MDBContainer, MDBRow, MDBCol } from "mdb-react-ui-kit";
import "./categories.css"; // Import custom CSS for additional styling

export default function Categories() {
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
    <MDBContainer fluid className="my-5 text-center categories-body">
      <h4 className="mt-4 mb-5">
        <strong>Collections</strong>
      </h4>

      <MDBRow className="mt-6 space-y-12 lg:space-y-0">
        {categories
          .filter((category) => category.status === "active")
          .map((category) => (
            <MDBCol key={category.category_id} md="6" lg="4" className="mb-4">
              <Link to={`/categories/${category.category_id}`} className="category-link">
                <div className="category-card shadow-sm p-3 rounded">
                  <div className="category-icon-wrapper">
                    <img
                      src={`http://localhost:3000/images/${category.name
                        .toLowerCase()
                        .replace(/ /g, "-")}.png`}
                      alt={category.name}
                      className="category-icon"
                    />
                  </div>
                  <h5 className="category-name mt-3">{category.name}</h5>
                  <p className="category-description mt-2">{category.description}</p>
                </div>
              </Link>
            </MDBCol>
          ))}
      </MDBRow>
    </MDBContainer>
  );
}
