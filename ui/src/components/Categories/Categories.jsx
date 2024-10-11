import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { MDBContainer, MDBRow, MDBCol, MDBRipple } from "mdb-react-ui-kit";

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
    <MDBContainer fluid className="my-5 text-center">
      <h4 className="mt-4 mb-5">
        <strong>Collections</strong>
      </h4>

      <MDBRow className="mt-6 space-y-12 lg:space-y-0">
        {categories
          .filter((category) => category.status === "active")
          .map((category) => (
            <MDBCol key={category.category_id} md="6" lg="4" className="mb-4">
              <MDBRipple
                rippleColor="dark"
                rippleTag="div"
                className="bg-image rounded hover-zoom shadow-1-strong"
              >
                <img
                  src={`http://localhost:3000/images/${category.name
                    .toLowerCase()
                    .replace(/ /g, "-")}.jpg`}
                  alt={category.name}
                  className="w-100 h-100 object-cover"
                />
                <Link to={`/categories/${category.category_id}`}>
                  <div
                    className="mask"
                    style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
                  >
                    <div className="d-flex justify-content-start align-items-start h-100">
                      <h5>
                        <span className="badge bg-light pt-2 ms-3 mt-3 text-dark">
                          {category.name}
                        </span>
                      </h5>
                    </div>
                  </div>
                  <div className="hover-overlay">
                    <div
                      className="mask"
                      style={{ backgroundColor: "rgba(251, 251, 251, 0.15)" }}
                    ></div>
                  </div>
                </Link>
              </MDBRipple>
              <p className="text-base font-semibold text-gray-900 mt-2">
                {category.description}
              </p>
            </MDBCol>
          ))}
      </MDBRow>
    </MDBContainer>
  );
}
