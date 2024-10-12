import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCheckbox,
  MDBBtn,
  MDBCardTitle,
} from 'mdb-react-ui-kit';

const ServiceProviderForm = () => {
  const [categories, setCategories] = useState([]);
  const [servicesByCategory, setServicesByCategory] = useState({});
  const [selectedServices, setSelectedServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategoriesAndServices = async () => {
      try {
        const categoriesResponse = await axios.get('http://localhost:3000/categories');
        const fetchedCategories = categoriesResponse.data;
        setCategories(fetchedCategories);

        const servicesData = {};
        for (const category of fetchedCategories) {
          const servicesResponse = await axios.get(`http://localhost:3000/services/${category.category_id}`);
          servicesData[category.category_id] = servicesResponse.data;
        }
        setServicesByCategory(servicesData);
      } catch (error) {
        console.error('Error fetching categories or services:', error);
      }
    };

    fetchCategoriesAndServices();
  }, []);

  const handleServiceChange = (serviceId) => {
    setSelectedServices((prevSelectedServices) => {
      if (prevSelectedServices.includes(serviceId)) {
        return prevSelectedServices.filter((id) => id !== serviceId);
      } else {
        return [...prevSelectedServices, serviceId];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        services: selectedServices.map((serviceId) => ({
          serviceId,
          available: true,
        })),
      };

      const response = await axios.post('http://localhost:3000/service-provider/preferences', data, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.data.message === 'Preferences updated successfully') {
        alert('Preferences updated successfully!');
        navigate("/ServiceProviderHome");
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
      alert('Failed to update preferences');
    }
  };

  return (
    <MDBContainer className="mt-5">
      <h2 className="text-center mb-4">Service Provider Preferences</h2>
      <form onSubmit={handleSubmit}>
        <MDBRow>
          {categories.map((category) => (
            <MDBCol md="4" key={category.category_id} className="mb-3">
              <MDBCard>
                <MDBCardBody>
                  <MDBCardTitle className="mb-3">{category.name}</MDBCardTitle>
                  {servicesByCategory[category.category_id] && servicesByCategory[category.category_id].map((service) => (
                    <div key={service.service_id} className="mb-2">
                      <MDBCheckbox
                        name="services"
                        label={service.name}
                        id={`service-${service.service_id}`}
                        value={service.service_id}
                        checked={selectedServices.includes(service.service_id)}
                        onChange={() => handleServiceChange(service.service_id)}
                      />
                    </div>
                  ))}
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          ))}
        </MDBRow>
        <MDBBtn type="submit" color="primary">Save Preferences</MDBBtn>
      </form>
    </MDBContainer>
  );
};

export default ServiceProviderForm;
