import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";
import { Navigate } from 'react-router-dom';

const ServiceRequestForm = () => {
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [cities, setCities] = useState([]);
  const [address, setAddress] = useState('');
  const { serviceId } = useParams();
   const Navigate=useNavigate();
  const validateForm = () => {
    if (!description || !city || !address) {
      alert('All fields are required.');
      return false;
    }
    
    return true;
  };
  useEffect(() => {
    // Fetch cities from the backend
    const fetchCities = async () => {
      try {
        const response = await axios.get('http://localhost:3000/cities');
        setCities(response.data); // Assume the API returns a list of cities
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };

    fetchCities();
  }, []);

  const handleSendToAll =  async () => {
    if (!validateForm())
         return;
    // Logic to handle sending the request to all service providers
    console.log("Service id ",serviceId);
    const requestData = {
      description,
      city_id:city,
      address,
      service_id:serviceId,
      // Other necessary data like user_id, category_id, etc. can be added
    };
      console.log('Sending request to all:', requestData);
      try {
       
        const response = await axios.post(
          `http://localhost:3000/servicerequestform`,
          requestData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        if(response.data==="Requests Sent!")
        {
            alert('Service request sent successfully');
            Navigate("/About");

        }
    
  
      } catch (error) {
        console.error('Error sending request:', error);
      }
  
    // API request to send the service request to all providers
  };

  const handleSelectSP = () => {
    // Logic to handle selecting a specific service provider
    const requestData = {
      description,
      city,
      address,
      // Other necessary data like user_id, category_id, etc. can be added
    };

    console.log('Select your own service provider:', requestData);
    // API request to allow the user to select a service provider
  };

  return (
    <div className="container mt-5">
      <h2 className="p-10">Describe Your Problem</h2>
      <form>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Problem Description
          </label>
          <textarea
            className="form-control"
            id="description"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="city" className="form-label">
            City
          </label>
          <select
           required
            className="form-control"
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          >
            <option value="">Select a city</option>
            {cities.map((cityItem) => (
              <option key={cityItem.city_id} value={cityItem.city_id}>
                {cityItem.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="address" className="form-label">
            Address
          </label>
          <input
            type="text"
            className="form-control"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>

        <div className="mt-4">
          <button type="button" className="btn btn-primary mr-2" onClick={handleSelectSP}>
            Select Service Provider Yourself
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleSendToAll}>
            Send Request to All Providers
          </button>
        </div>
      </form>
    </div>
  );
};

export default ServiceRequestForm;
