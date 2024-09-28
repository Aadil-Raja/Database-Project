import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./ServiceProviderForm.css";

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
        navigate("/ServiceProviderHome");
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
      alert('Failed to update preferences');
    }
  };

  return (
    <>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.1.3/dist/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous"></link>
      <div className="container mt-5">
        <h2 className='p-10'>Service Provider Preferences</h2>
        <form onSubmit={handleSubmit}>
          <div className="row">
            {/* Render categories and their services */}
            {categories.map((category) => (
              <div key={category.category_id} className="col-md-4 mb-3">
                <div className="list-group">
                  <h3 className="list-group-item list-group-item-action active">{category.name}</h3>
                  {servicesByCategory[category.category_id] && servicesByCategory[category.category_id].map((service) => (
                    <label key={service.service_id} className="list-group-item d-flex gap-2">
                      <input
                        className="form-check-input flex-shrink-0"
                        type="checkbox"
                        checked={selectedServices.includes(service.service_id)}
                        onChange={() => handleServiceChange(service.service_id)}
                      />
                      <span>{service.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary">Save Preferences</button>
        </form>
      </div>
      <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
      <script src="https://cdn.jsdelivr.net/npm/popper.js@1.14.3/dist/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.1.3/dist/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>
    </>
  );
};

export default ServiceProviderForm;
