import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ServiceProviderForm = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3000/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      const fetchServices = async () => {
        try {
          const response = await axios.get(`http://localhost:3000/services/${selectedCategory}`);
          setServices(response.data);
        } catch (error) {
          console.error('Error fetching services:', error);
        }
      };

      fetchServices();
    }
  }, [selectedCategory]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedServices([]);
  };

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
          available: true, // Default availability to true
        })),
      };

      await axios.post('http://localhost:3000/service-provider/preferences', data, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }});
      alert('Preferences updated successfully!');
    } catch (error) {
      console.error('Error updating preferences:', error);
      alert('Failed to update preferences');
    }
  };

  return (
    <div>
      <h2>Service Provider Preferences</h2>
      <form onSubmit={handleSubmit}>
        {/* Category Selection */}
        <div>
          <label>Category:</label>
          <select value={selectedCategory} onChange={handleCategoryChange} required>
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.category_id} value={category.category_id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Services Selection */}
        {selectedCategory && (
          <div>
            <h3>Services</h3>
            {services.map((service) => (
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
        )}

        {/* Submit Button */}
        <button type="submit">Save Preferences</button>
      </form>
    </div>
  );
};

export default ServiceProviderForm;
