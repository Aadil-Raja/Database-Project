import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { MDBContainer, MDBRow, MDBCol } from "mdb-react-ui-kit";
import "./categoryDetails.css"; // Import custom CSS for additional styling

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
    <MDBContainer fluid className="my-5 text-center services-body">
      {category.status === 'active' && (
        <>
          <h4 className="mt-4 mb-5">
            <strong>{category.name}</strong>
          </h4>
          <p className="text-lg text-gray-600">{category.description}</p>

          <MDBRow className="mt-6 space-y-12 lg:space-y-0">
            {services
              .filter((service) => service.status === 'active')
              .map((service, index) => (
                <MDBCol key={index} md="6" lg="4" className="mb-4">
                  <Link to={`/categories/${service.service_id}/servicerequestform`} className="service-link">
                    <div className="service-card shadow-sm p-3 rounded">
                      <div className="service-icon-wrapper">
                        <img
                          src={`http://localhost:3000/images/${service.name.toLowerCase().replace(/ /g, '-')}.png`}
                          alt={service.name}
                          className="service-icon"
                        />
                      </div>
                      <h5 className="service-name mt-3">{service.name}</h5>
                      <p className="service-description mt-2">{service.description}</p>
                    </div>
                  </Link>
                </MDBCol>
              ))}
          </MDBRow>
        </>
      )}
    </MDBContainer>
  );
}
