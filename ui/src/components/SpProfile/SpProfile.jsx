import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCardText,
  MDBBtn,
  MDBInput,
  MDBBreadcrumb,
  MDBBreadcrumbItem,
  MDBListGroup,
  MDBListGroupItem,
  MDBIcon,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody

} from 'mdb-react-ui-kit';
import './SpProfile.css'

const ProfileTab = () => {
  const [profile, setProfile] = useState(null);
  const [cities, setCities] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [services, setServices] = useState([]); // Services offered by the service provider
  const [selectedServices, setSelectedServices] = useState([]); // For managing selected services
  const [newSelectedServices, setnewSelectedServices] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const [categories, setCategories] = useState([]);
  const [servicesByCategory, setServicesByCategory] = useState({});
  const handleTabChange = (tab) => setActiveTab(tab);
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get("http://localhost:3000/cities");
        setCities(response.data);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };
    fetchCities();
  }, []);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:3000/service-provider/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, []);
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
  const handleServiceChange = (serviceId) => {
    setSelectedServices((prevSelectedServices) => {
      if (prevSelectedServices.includes(serviceId)) {
        return prevSelectedServices.filter((id) => id !== serviceId);
      } else {
        return [...prevSelectedServices, serviceId];
      }
    });
  };
  const handleReqService = () => {
    navigate('/RequestCategory');
  }
  const handleNewServiceChange = (serviceId) => {
    setnewSelectedServices((prevNewSelectedServices) => {
      if (prevNewSelectedServices.includes(serviceId)) {
        // If the service is already selected, remove it from the array
        return prevNewSelectedServices.filter((id) => id !== serviceId);
      } else {
        // Otherwise, add it to the array
        return [...prevNewSelectedServices, serviceId];
      }
    });

  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = {
        services: newSelectedServices.map((serviceId) => ({
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

      }
      window.location.reload();
    } catch (error) {
      console.error('Error updating preferences:', error);
      alert('Failed to update preferences');
    }
  };


  // Mark a service as unavailable
  const handleToggleAvailability = async (serviceId, currentAvailability) => {
    try {
      const newAvailability = !currentAvailability; // Toggle the current availability status
      await axios.put(`http://localhost:3000/service-provider/updateAvailability/${serviceId}`, { available: newAvailability }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      // Update the state to reflect the new availability status
      setServices(services.map(service =>
        service.service_id === serviceId ? { ...service, availability_status: newAvailability } : service
      ));

      alert(`Service ${newAvailability ? 'marked as available' : 'marked as unavailable'}`);
    } catch (error) {
      console.error('Error updating service availability:', error);
      alert('Failed to update service availability');
    }
  };
  const handleRemoveService = async (serviceId) => {
    try {
      await axios.delete(`http://localhost:3000/service-provider/removeService/${serviceId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setServices(services.filter(service => service.service_id !== serviceId)); // Remove service from UI
      alert('Service removed successfully');
    } catch (error) {
      console.error('Error removing service:', error);
      alert('Failed to remove service');
    }
  };

  const handleSaveProfile = async () => {
    try {
      const formData = new FormData();
      formData.append('firstName', profile.firstName);
      formData.append('lastName', profile.lastName);
      formData.append('phone', profile.phone);
      formData.append('address', profile.address);
      formData.append('city_id', profile.city_id);
      formData.append('gender', profile.gender);
      formData.append('dob', profile.dob);
      formData.append('email', profile.email);

      formData.append('folder', "profile");
      if (selectedImage) {
        formData.append('profileImage', selectedImage);
      }

      await axios.put('http://localhost:3000/service-provider/updateProfile', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  useEffect(() => {
    if (activeTab === 'services' || activeTab === 'add-services') {
      const fetchServices = async () => {
        try {
          const response = await axios.get('http://localhost:3000/service-provider/services', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          setServices(response.data.services);
          setSelectedServices(response.data.services.map(service => service.service_id)); // Select current services
        } catch (error) {
          console.error('Error fetching services:', error);
        }
      };

      fetchServices();
    }
  }, [activeTab]);

  if (!profile) return <div>Loading...</div>;

  return (
    <MDBContainer className="py-5">
      <MDBTabs className="mb-3">
        <MDBTabsItem>
          <MDBTabsLink onClick={() => handleTabChange('profile')} active={activeTab === 'profile'}>
            <MDBIcon fas icon="user" className="me-2" /> Profile
          </MDBTabsLink>
        </MDBTabsItem>
        <MDBTabsItem>
          <MDBTabsLink onClick={() => handleTabChange('services')} active={activeTab === 'services'}>
            <MDBIcon fas icon="briefcase" className="me-2" /> Services Offered
          </MDBTabsLink>
        </MDBTabsItem>
        <MDBTabsItem>
          <MDBTabsLink onClick={() => handleTabChange('add-services')} active={activeTab === 'add-services'}>
            <MDBIcon fas icon="plus-circle" className="me-2" /> Add New Services
          </MDBTabsLink>
        </MDBTabsItem>
      </MDBTabs>

      <MDBTabsContent>
        <MDBTabsPane open={activeTab === 'profile'}> {/* Replace `activeTab === 'profile'` with true for testing */}
          <MDBRow>
            <MDBCol lg="4">
              <MDBCard className="mb-4 profile-container">
                <MDBCardBody className="text-center">
                  <MDBCardImage
                    src={
                      selectedImage
                        ? URL.createObjectURL(selectedImage)
                        : `http://localhost:3000/profile/${profile.email}.jpg`
                    }
                    alt="Upload Profile Image"
                    className="rounded-circle profile-picture"
                    style={{ width: '150px', cursor: 'pointer' }}
                    fluid
                    onClick={() => {
                      console.log('Image clicked');
                      setModalOpen(true);
                    }}
                     // Open modal when image is clicked
                     onError={(e) => { e.target.onerror = null; e.target.src = 'http://localhost:3000/profile/default-avatar.png'; }} 
                  />
                  {isEditing && (
                    <div className="mt-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setSelectedImage(e.target.files[0])}
                      />
                    </div>
                  )}
                  <h4 className="mt-3">{profile.firstName} {profile.lastName}</h4>
                  <MDBBtn outline className="mt-3 profile-btn" onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </MDBBtn>
                  {isEditing && <MDBBtn className="mt-3 profile-btn" onClick={handleSaveProfile}>Save Changes</MDBBtn>}
                </MDBCardBody>
              </MDBCard>
            </MDBCol>

            <MDBCol lg="8">
              <MDBCard className="mb-4 profile-details-card">
                <MDBCardBody>
                  <MDBListGroup flush className="profile-details-list">
                    <MDBListGroupItem className="d-flex align-items-center profile-item">
                      <div className="profile-label"><strong>Name:</strong></div>
                      <div className="profile-value">
                        {isEditing ? (
                          <div className="d-flex">
                            <MDBInput
                              type="text"
                              value={profile.firstName}
                              onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                              size="sm"
                              className="me-2 profile-input"
                            />
                            <MDBInput
                              type="text"
                              value={profile.lastName}
                              onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                              size="sm"
                              className="profile-input"
                            />
                          </div>
                        ) : (
                          <MDBCardText className="text-muted profile-text">{profile.firstName} {profile.lastName}</MDBCardText>
                        )}
                      </div>
                    </MDBListGroupItem>
                    <MDBListGroupItem className="d-flex align-items-center profile-item">
                      <div className="profile-label"><strong>Phone:</strong></div>
                      <div className="profile-value">
                        {isEditing ? (
                          <MDBInput
                            type="text"
                            value={profile.phone}
                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                            size="sm"
                            className="profile-input"
                          />
                        ) : (
                          <MDBCardText className="text-muted profile-text">{profile.phone}</MDBCardText>
                        )}
                      </div>
                    </MDBListGroupItem>
                    <MDBListGroupItem className="d-flex align-items-center profile-item">
                      <div className="profile-label"><strong>Address:</strong></div>
                      <div className="profile-value">
                        {isEditing ? (
                          <MDBInput
                            type="text"
                            value={profile.address}
                            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                            size="sm"
                            className="profile-input"
                          />
                        ) : (
                          <MDBCardText className="text-muted profile-text">{profile.address}</MDBCardText>
                        )}
                      </div>
                    </MDBListGroupItem>
                    <MDBListGroupItem className="d-flex align-items-center profile-item">
  <div className="profile-label"><strong>City:</strong></div>
  <div className="profile-value">
    {isEditing ? (
      <select
        name="city_id"
        value={profile.city_id || ''}
        onChange={(e) => setProfile({ ...profile, city_id: e.target.value })}
        className="form-select"
      >
        <option value="">Select City</option>
        {cities.map((city) => (
          <option key={city.city_id} value={city.city_id}>
            {city.name}
          </option>
        ))}
      </select>
    ) : (
      <MDBCardText className="text-muted profile-text">{profile.city_name}</MDBCardText>
    )}
  </div>
</MDBListGroupItem>

                    <MDBListGroupItem className="d-flex align-items-center profile-item">
                      <div className="profile-label"><strong>Gender:</strong></div>
                      <div className="profile-value">
                        {isEditing ? (
                          <select
                            value={profile.gender}
                            onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                            className="form-select form-select-sm profile-select"
                          >
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                          </select>
                        ) : (
                          <MDBCardText className="text-muted profile-text">{profile.gender}</MDBCardText>
                        )}
                      </div>
                    </MDBListGroupItem>
                    <MDBListGroupItem className="d-flex align-items-center profile-item">
                      <div className="profile-label"><strong>Date of Birth:</strong></div>
                      <div className="profile-value">
                        {isEditing ? (
                          <MDBInput
                            type="date"
                            value={profile.dob}
                            onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                            size="sm"
                            className="profile-input"
                          />
                        ) : (
                          <MDBCardText className="text-muted profile-text">{profile.dob}</MDBCardText>
                        )}
                      </div>
                    </MDBListGroupItem>
                  </MDBListGroup>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
          {modalOpen && (
  <div className="custom-modal">
    <div className="modal-content">
      <button className="close-button" onClick={() => setModalOpen(false)}>X</button>
      <img
        src={
          selectedImage
            ? URL.createObjectURL(selectedImage)
            : `http://localhost:3000/profile/${profile.email}.jpg`
        }
        alt="Expanded Profile"
        onError={(e) => { 
          e.target.onerror = null; 
          e.target.src = 'http://localhost:3000/profile/default-avatar.png'; 
        }}
      />
    </div>
  </div>
)}


        </MDBTabsPane>

        <MDBTabsPane open={activeTab === 'services'}>
          <div className="services-container">
            <h1 className="services-header"> Your Services</h1>
            <hr className="services-divider" />
            {services.map((service, index) => (
              <div key={index} className="service-item d-flex align-items-center justify-content-between">
                <div className="service-info">
                  <p><strong>Service:</strong> {service.service_name}</p>
                  <p><strong>Category:</strong> {service.category_name}</p>
                  <label className="availability-label">
                    Available:
                    <input
                      type="checkbox"
                      checked={Boolean(service.availability_status)}
                      onChange={() => handleToggleAvailability(service.service_id, service.availability_status)}
                      className="availability-checkbox"
                    />
                  </label>
                </div>
                <button
                  type="button"
                  className="btn btn-danger remove-service-btn"
                  onClick={() => handleRemoveService(service.service_id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </MDBTabsPane>


        <MDBTabsPane open={activeTab === 'add-services'}>
          <div className="preferences-body">
            <div className="preferences-container">
              <h1 className="profile-header"> Select Preferences</h1>
              <hr />
              <form onSubmit={handleSubmit}>
                <div className="row">
                  {categories.map((category) => (
                    <div key={category.category_id} className="col-md-4 mb-3">
                      <div className="list-group">
                        <h3 className="list-group-item list-group-item-action active">{category.name}</h3>
                        {servicesByCategory[category.category_id] && servicesByCategory[category.category_id].map((service) => (
                          <label key={service.service_id} className="list-group-item d-flex gap-1">
                            {selectedServices.includes(service.service_id) ? (
                              <span>{service.name} (Already selected)</span>
                            ) : (
                              <>
                                <input
                                  className="preferences-form-check-input flex-shrink-0"
                                  type="checkbox"
                                  checked={newSelectedServices.includes(service.service_id)}
                                  onChange={() => handleNewServiceChange(service.service_id)}
                                />
                                <span>{service.name}</span>
                              </>
                            )}
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="savepref text-center ">
                  <button type="submit" className="btn save-btn">
                    Save Preferences
                  </button>
                  <button type="button" className="btn save-btn" onClick={handleReqService}>Request a new Service</button>
                </div>
              </form>
            </div>
          </div>
        </MDBTabsPane>
      </MDBTabsContent>
    </MDBContainer>
  );
};

export default ProfileTab;
