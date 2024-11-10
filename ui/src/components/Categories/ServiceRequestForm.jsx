import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBTextArea,
  MDBBtn,

} from 'mdb-react-ui-kit';
import './categoryDetails.css'

const ServiceRequestForm = () => {
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [cities, setCities] = useState([]);
  const [address, setAddress] = useState('');
  const { serviceId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get('http://localhost:3000/cities');
        setCities(response.data);
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };
    fetchCities();
  }, []);

  const validateForm = () => {
    if (!description || !city || !address) {
      alert('All fields are required.');
      return false;
    }
    return true;
  };

  const handleSendToAll = async () => {
    if (!validateForm()) return;
    const requestData = {
      description,
      city_id: city,
      address,
      service_id: serviceId,
    };
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
      if (response.data === 'Requests Sent!') {
        alert('Service request sent successfully');
        navigate('/ClientDashBoard');
      }
    } catch (error) {
      console.error('Error sending request:', error);
    }
  };

  const handleSelectSP = () => {
    const requestData = {
      description,
      city,
      address,
    };
    console.log('Select your own service provider:', requestData);
  };

  return (
    <MDBContainer fluid className="my-5">
      <MDBRow className="d-flex justify-content-center align-items-center service-request-form-section" >
        <MDBCol lg="8" className="my-5">
          <MDBCard>
            <MDBCardBody className="px-4">
              <h4 className="text-center mb-4">Describe Your Problem</h4>
              <MDBRow className="align-items-center mb-4">
                <MDBCol md="3">
                  <h6 className="mb-0">Problem Description</h6>
                </MDBCol>
                <MDBCol md="9">
                  <MDBTextArea
                    label="Problem Description"
                    rows="4"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </MDBCol>
              </MDBRow>

              <MDBRow className="align-items-center mb-4">
                <MDBCol md="3">
                  <h6 className="mb-0">City</h6>
                </MDBCol>
                <MDBCol md="9">
                  <select
                    className="form-control"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  >
                    <option value="">Select a city</option>
                    {cities.map((cityItem) => (
                      <option key={cityItem.city_id} value={cityItem.city_id}>
                        {cityItem.name}
                      </option>
                    ))}
                  </select>
                </MDBCol>
              </MDBRow>

              <MDBRow className="align-items-center mb-4">
                <MDBCol md="3">
                  <h6 className="mb-0">Address</h6>
                </MDBCol>
                <MDBCol md="9">
                  <MDBInput
                    label="Address"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </MDBCol>
              </MDBRow>

              <div className="text-center mt-3">
             
                <MDBBtn color="primary" onClick={handleSendToAll}>
                Apply
                </MDBBtn>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default ServiceRequestForm;
