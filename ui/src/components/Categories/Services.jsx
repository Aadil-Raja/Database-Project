import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { MDBContainer, MDBRow, MDBCol, MDBRipple } from "mdb-react-ui-kit";

export default function CategoryDetails() {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchCategoryDetails = async () => {
      try {
        const categoryResponse = await axios.get(`http://localhost:3000/categories/${categoryId}`);
        setCategory(categoryResponse.data);

        const servicesResponse = await axios.get(`http://localhost:3000/services/${categoryId}`);
        setServices(servicesResponse.data);
      } catch (error) {
        console.error("Error fetching category or services:", error);
      }
    };

    fetchCategoryDetails();
  }, [categoryId]);

  if (!category) return <p>Loading...</p>;

  return (
    <MDBContainer fluid className="my-5 text-center">
      {category.status === 'active' && (
        <>
          <h4 className="mt-4 mb-5">
            <strong>{category.name}</strong>
          </h4>
          <p className="text-lg text-gray-600">{category.description}</p>

          <MDBRow className="mt-6 space-y-12 lg:space-y-0">
            {services
              .filter(service => service.status === 'active')
              .map((service, index) => (
                <MDBCol key={index} md="6" lg="4" className="mb-4">
                  <MDBRipple
                    rippleColor="dark"
                    rippleTag="div"
                    className="bg-image rounded hover-zoom shadow-1-strong"
                  >
                    <img
                      src={`http://localhost:3000/images/${service.name.toLowerCase().replace(/ /g, '-')}.jpg`}
                      alt={service.name}
                      className="w-100 h-100 object-cover"
                    />
                    <Link to={`/categories/${service.service_id}/servicerequestform`}>
                      <div
                        className="mask"
                        style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
                      >
                        <div className="d-flex justify-content-start align-items-start h-100">
                          <h5>
                            <span className="badge bg-light pt-2 ms-3 mt-3 text-dark">
                              {service.name}
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
                </MDBCol>
              ))}
          </MDBRow>
        </>
      )}
    </MDBContainer>
  );
}
