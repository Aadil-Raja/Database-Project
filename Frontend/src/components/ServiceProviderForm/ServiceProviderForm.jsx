import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ServiceProviderForm = () => {
  const [categories, setCategories] = useState([]);
  const [servicesByCategory, setServicesByCategory] = useState({}); // Stores services for each category
  const [selectedServices, setSelectedServices] = useState([]);
  const navigate = useNavigate();

  // Fetch categories and services for each category on component mount
  useEffect(() => {
    const fetchCategoriesAndServices = async () => {
      try {
        const categoriesResponse = await axios.get('http://localhost:3000/categories');
        const fetchedCategories = categoriesResponse.data;
        setCategories(fetchedCategories);

        // Fetch services for each category
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

  // Handle service selection
  const handleServiceChange = (serviceId) => {
    setSelectedServices((prevSelectedServices) => {
      if (prevSelectedServices.includes(serviceId)) {
        return prevSelectedServices.filter((id) => id !== serviceId);
      } else {
        return [...prevSelectedServices, serviceId];
      }
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = {
        services: selectedServices.map((serviceId) => ({
          serviceId,
          available: true, // Default availability to true
        })),
      };

      const response = await axios.post('http://localhost:3000/service-provider/preferences', data, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.data.message === 'Preferences updated successfully') {
        alert('Preferences updated successfully!');
        navigate("/About");
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
      alert('Failed to update preferences');
    }
  };

  return (
    <div>
      <h2>Service Provider Preferences</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
          {/* Render categories and their services */}
          {categories.map((category) => (
            <div key={category.category_id} style={{ margin: '10px', padding: '10px', border: '1px solid #ccc', width: '200px' }}>
              <h3>{category.name}</h3>
              {servicesByCategory[category.category_id] && servicesByCategory[category.category_id].map((service) => (
                <div key={service.service_id}>
                  <input
                    type="checkbox"
                    checked={selectedServices.includes(service.service_id)}
                    onChange={() => handleServiceChange(service.service_id)}
                  />
                  <label>{service.name}</label>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <button type="submit">Save Preferences</button>
      </form>
    </div>
  );
};

export default ServiceProviderForm;
