import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  MDBTabsPane
} from 'mdb-react-ui-kit';

const ProfileTab = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [services, setServices] = useState([]); // Services offered by the service provider
  const [selectedServices, setSelectedServices] = useState([]); // For managing selected services
  const [newSelectedServices, setnewSelectedServices] = useState([]);

  const [categories, setCategories] = useState([]);
  const [servicesByCategory, setServicesByCategory] = useState({});
  const handleTabChange = (tab) => setActiveTab(tab);
 
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
      await axios.put('http://localhost:3000/service-provider/updateProfile', profile, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
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
    <MDBTabs className='mb-3'>
      <MDBTabsItem>
        <MDBTabsLink onClick={() => handleTabChange('profile')} active={activeTab === 'profile'}>
          <MDBIcon fas icon='user' className='me-2' /> Profile
        </MDBTabsLink>
      </MDBTabsItem>
      <MDBTabsItem>
        <MDBTabsLink onClick={() => handleTabChange('services')} active={activeTab === 'services'}>
          <MDBIcon fas icon='briefcase' className='me-2' /> Services Offered
        </MDBTabsLink>
      </MDBTabsItem>
      <MDBTabsItem>
        <MDBTabsLink onClick={() => handleTabChange('add-services')} active={activeTab === 'add-services'}>
          <MDBIcon fas icon='plus-circle' className='me-2' /> Add New Services
        </MDBTabsLink>
      </MDBTabsItem>
    </MDBTabs>
     
      <MDBTabsContent>


      <MDBTabsPane open={activeTab === 'profile'}>
      <MDBRow>
        <MDBCol lg="4">
          <MDBCard className="mb-4">
            <MDBCardBody className="text-center">
              <MDBCardImage
                src="https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
                alt="Profile"
                className="rounded-circle"
                style={{ width: '150px' }}
                fluid
              />
              <h4 className="mt-3">{profile.firstName} {profile.lastName}</h4>
              <MDBBtn outline className="mt-3" onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </MDBBtn>
              {isEditing && <MDBBtn className="mt-3" onClick={handleSaveProfile}>Save Changes</MDBBtn>}
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        <MDBCol lg="8">
          <MDBCard className="mb-4">
            <MDBCardBody>
              <MDBListGroup flush>
                <MDBListGroupItem className="d-flex justify-content-between align-items-center">
                  <strong>Name:</strong>
                  {isEditing ? (
                    <div className="d-flex">
                      <MDBInput
                        type="text"
                        value={profile.firstName}
                        onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                        size="sm"
                        style={{ marginRight: '5px' }}
                      />
                      <MDBInput
                        type="text"
                        value={profile.lastName}
                        onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                        size="sm"
                      />
                    </div>
                  ) : (
                    <MDBCardText className="text-muted">{profile.firstName} {profile.lastName}</MDBCardText>
                  )}
                </MDBListGroupItem>
                
                <MDBListGroupItem className="d-flex justify-content-between align-items-center">
                  <strong>Phone:</strong>
                  {isEditing ? (
                    <MDBInput
                      type="text"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      size="sm"
                    />
                  ) : (
                    <MDBCardText className="text-muted">{profile.phone}</MDBCardText>
                  )}
                </MDBListGroupItem>

                <MDBListGroupItem className="d-flex justify-content-between align-items-center">
                  <strong>Address:</strong>
                  {isEditing ? (
                    <MDBInput
                      type="text"
                      value={profile.address}
                      onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                      size="sm"
                    />
                  ) : (
                    <MDBCardText className="text-muted">{profile.address}</MDBCardText>
                  )}
                </MDBListGroupItem>

                <MDBListGroupItem className="d-flex justify-content-between align-items-center">
                  <strong>City:</strong>
                  {isEditing ? (
                    <MDBInput
                      type="text"
                      value={profile.city}
                      onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                      size="sm"
                    />
                  ) : (
                    <MDBCardText className="text-muted">{profile.city}</MDBCardText>
                  )}
                </MDBListGroupItem>

                <MDBListGroupItem className="d-flex justify-content-between align-items-center">
                  <strong>Gender:</strong>
                  {isEditing ? (
                    <select
                      value={profile.gender}
                      onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                      className="form-select form-select-sm"
                      style={{ width: 'auto' }}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  ) : (
                    <MDBCardText className="text-muted">{profile.gender}</MDBCardText>
                  )}
                </MDBListGroupItem>

                <MDBListGroupItem className="d-flex justify-content-between align-items-center">
                  <strong>Date of Birth:</strong>
                  {isEditing ? (
                    <MDBInput
                      type="date"
                      value={profile.dob}
                      onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                      size="sm"
                    />
                  ) : (
                    <MDBCardText className="text-muted">{profile.dob}</MDBCardText>
                  )}
                </MDBListGroupItem>
              </MDBListGroup>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
      </MDBTabsPane>
      <MDBTabsPane open={activeTab === 'services'}>
         {/* Services Offered Tab */}
       
          <div className="services-container shadow p-3 mb-5 bg-body-tertiary rounded">
            <h1 className="profile-header">Services Offered</h1>
            <hr />
            {/* // Services offered content */}
            {services.map((service) => (
              <div key={service.sp_service_id} className="service-item">
                <p><strong>Service:</strong> {service.service_name}</p>
                <p><strong>Category:</strong> {service.category_name}</p>
                <label>
                  Available:
                  <input
                    type="checkbox"
                    checked={Boolean(service.availability_status)}
                    onChange={() => handleToggleAvailability(service.service_id, service.availability_status)}
                  />
                </label>
                <button type="button" className="btn btn-danger" onClick={() => handleRemoveService(service.service_id)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
       
        </MDBTabsPane>
        <MDBTabsPane open={activeTab === 'add-services'}>
          <div className='preferences'>
            <div className="container shadow p-3 mb-5 bg-body-tertiary rounded">
              <h1 className="profile-header">Service Provider Preferences</h1>
              <hr />
              <form onSubmit={handleSubmit}>
                <div className="row">
                  {/* // Categories and services selection content */}
                  {categories.map((category) => (
                    <div key={category.category_id} className="col-md-4 mb-3">
                      <div className="list-group">
                        <h3 className="list-group-item list-group-item-action active" style={{ backgroundColor: "#A4EBF3", color: "black", border: "2px solid black" }}>
                          {category.name}
                        </h3>
                        {servicesByCategory[category.category_id] && servicesByCategory[category.category_id].map((service) => (
                          <label key={service.service_id} className="list-group-item d-flex gap-1">
                            {selectedServices.includes(service.service_id) ? (
                              <span>{service.name} (Already selected)</span>
                            ) : (
                              <>
                                <input
                                  className="form-check-input flex-shrink-0"
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
                <div className='savepref'>
                  <button type="submit" className="btn">
                    Save Preferences
                  </button>
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
