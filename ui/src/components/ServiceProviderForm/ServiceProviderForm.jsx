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
import './ServiceProviderForm.css';

const ServiceProviderForm = () => {
  const [categories, setCategories] = useState([]);
  const [servicesByCategory, setServicesByCategory] = useState({});
  const [selectedServices, setSelectedServices] = useState([]);
  const BASE_URL = import.meta.env.VITE_BACKEND_URL ;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategoriesAndServices = async () => {
      try {
        const categoriesResponse = await axios.get(`${BASE_URL}/categories`);
        const fetchedCategories = categoriesResponse.data;
        setCategories(fetchedCategories);

        const servicesData = {};
        for (const category of fetchedCategories) {
          const servicesResponse = await axios.get(`${BASE_URL}/services/${category.category_id}`);
          servicesData[category.category_id] = servicesResponse.data;
        }
        setServicesByCategory(servicesData);
      } catch (error) {
        console.error('Error fetching categories or services:', error);
      }
    };

    fetchCategoriesAndServices();
  }, []);

  const handleReqService = () => {
    navigate('/RequestCategory');
  }
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

      const response = await axios.post(`${BASE_URL}/service-provider/preferences`, data, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.data.message === 'Preferences updated successfully') {
        alert('Preferences updated successfully!');
        navigate("/SpProfile");
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
      alert('Failed to update preferences');
    }
  };

  return (
    <MDBContainer className="mt-5 sp-form-body">
      <h1 className="text-center mb-4 sp-form-title">Service Provider Preferences</h1>
      <form onSubmit={handleSubmit}>
        <MDBRow className="justify-content-center">
          {categories.map((category) => (
            <MDBCol md="6" lg="4" key={category.category_id} className="mb-4">
              <MDBCard className="sp-card shadow-sm">
                <MDBCardBody>
                  <MDBCardTitle className="mb-3 sp-card-title">{category.name}</MDBCardTitle>
                  <div className="sp-checkbox-group">
                    {servicesByCategory[category.category_id] && servicesByCategory[category.category_id].map((service) => (
                      <div key={service.service_id} className="mb-2">
                        <MDBCheckbox
                          name="services"
                          label={service.name}
                          id={`service-${service.service_id}`}
                          value={service.service_id}
                          checked={selectedServices.includes(service.service_id)}
                          onChange={() => handleServiceChange(service.service_id)}
                          className="sp-checkbox"
                        />
                      </div>
                    ))}
                  </div>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          ))}
        </MDBRow>
        <div className="text-center mt-4">
          <MDBBtn type="submit" className="sp-submit-btn primary-btn">
            Save Preferences
          </MDBBtn>
          <MDBBtn type="button" className="sp-submit-btn primary-btn">
            Skip now
          </MDBBtn>
          <MDBBtn type="button" className="sp-submit-btn primary-btn" onClick={handleReqService}>
            Can't find the service? Request here
          </MDBBtn>
        </div>

      </form>
    </MDBContainer>
  );
};

export default ServiceProviderForm;