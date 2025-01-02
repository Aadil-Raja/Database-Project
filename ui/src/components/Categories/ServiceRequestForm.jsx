import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
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
  MDBProgress,
  MDBProgressBar,
  MDBBreadcrumb,
  MDBBreadcrumbItem,
} from 'mdb-react-ui-kit';
import './serviceRequestForm.css';

const ServiceRequestForm = () => {
  const [description, setDescription] = useState('');
  const [city, setCity] = useState('');
  const [cities, setCities] = useState([]);
  const [address, setAddress] = useState('');
  const [file, setFile] = useState(null); // Added for file upload
  const { serviceId, categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [service, setService] = useState(null);
  const navigate = useNavigate();
  const [progress, setProgress] = useState(33);
  const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/cities`);
        setCities(response.data);
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };
    fetchCities();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryResponse = await axios.get(`${BASE_URL}/categories/${categoryId}`);
        setCategory(categoryResponse.data);

        const serviceResponse = await axios.get(`${BASE_URL}/getServiceName?service_id=${serviceId}`);
        setService(serviceResponse.data);
      } catch (error) {
        console.error('Error fetching category or service:', error);
      }
    };
    fetchData();
  }, [categoryId, serviceId]);

  const validateForm = () => {
    if (!description || !city || !address) {
      alert('All fields are required.');
      return false;
    }
    return true;
  };

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    const filledFields = [description, city, address].filter(Boolean).length;
    setProgress(((filledFields + 1) / 3) * 100);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSendToAll = async () => {
    if (!validateForm()) return;
  

    
    try {
      // First, send the service request data to create the request
      const response = await axios.post(
        `${BASE_URL}/servicerequestform`,
        {
          description,
          city_id: city,
          address,
          service_id: serviceId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      const { result } = response.data;
      const insertID=result;
 
      if (file) {
        const formData = new FormData();
        formData.append('insertID', insertID);
        formData.append('folder','RequestImages');
        formData.append('requestImg', file);
        

        await axios.post(`${BASE_URL}/servicerequestform/uploadImage`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      }
      
      if (response.data.message === 'Requests Sent!') {
        alert('Service request sent successfully');
        navigate('/ClientDashBoard');
      }
    } catch (error) {
      console.error('Error sending request:', error);
    }
  };

  return (
    <MDBContainer fluid className="my-5 service-request-form-body">
      <MDBBreadcrumb className="mx-3">
        <MDBBreadcrumbItem>
          <Link to="/Categories">Categories</Link>
        </MDBBreadcrumbItem>
        <MDBBreadcrumbItem>
          <Link to={`/Categories/${categoryId}`}>{category ? category.name : 'Loading...'}</Link>
        </MDBBreadcrumbItem>
        <MDBBreadcrumbItem active>{service ? service.name : 'Loading...'}</MDBBreadcrumbItem>
        <MDBBreadcrumbItem active>Request Form</MDBBreadcrumbItem>
      </MDBBreadcrumb>

      <MDBRow className="d-flex justify-content-center align-items-center service-request-form-2">
        <MDBCol lg="8">
          <MDBCard>
            <MDBCardBody className="px-4">
              <h3 className="text-center mb-4">Request Service</h3>
              <MDBProgress className="mb-4">
                <MDBProgressBar width={progress} valuemin={0} valuemax={100}>
                  {Math.round(progress)}%
                </MDBProgressBar>
              </MDBProgress>

              <MDBRow className="mb-4">
                <MDBCol md="3">
                  <h6 className="mb-0">Problem Description</h6>
                </MDBCol>
                <MDBCol md="9">
                  <MDBTextArea
                    label="Describe your problem"
                    rows="4"
                    value={description}
                    onChange={handleInputChange(setDescription)}
                    required
                  />
                </MDBCol>
              </MDBRow>

              <MDBRow className="mb-4">
                <MDBCol md="3">
                  <h6 className="mb-0">City</h6>
                </MDBCol>
                <MDBCol md="9">
                  <select
                    className="form-control"
                    value={city}
                    onChange={handleInputChange(setCity)}
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

              <MDBRow className="mb-4">
                <MDBCol md="3">
                  <h6 className="mb-0">Address</h6>
                </MDBCol>
                <MDBCol md="9">
                  <MDBInput
                    label="Your address"
                    type="text"
                    value={address}
                    onChange={handleInputChange(setAddress)}
                    required
                  />
                </MDBCol>
              </MDBRow>

              <MDBRow className="mb-4">
                <MDBCol md="3">
                  <h6 className="mb-0">Upload File</h6>
                </MDBCol>
                <MDBCol md="9">
                  <MDBInput
                    type="file"
                    onChange={handleFileChange}
                  />
                </MDBCol>
              </MDBRow>

              <div className="text-center mt-4">
                <MDBBtn color="primary" onClick={handleSendToAll}>
                  Submit Request
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
