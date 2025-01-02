import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./SpProfile.css";

const SpProfile = () => {
  const [activeTab, setActiveTab] = useState('profile'); // Control the active tab
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Toggle for editing mode
  const [services, setServices] = useState([]); // Services offered by the service provider
  const [selectedServices, setSelectedServices] = useState([]); // For managing selected services
  const [newSelectedServices, setnewSelectedServices] = useState([]);

  const [categories, setCategories] = useState([]);
  const [servicesByCategory, setServicesByCategory] = useState({});

  const handleSaveProfile = async () => {
    try {
      const response = await axios.put('${VITE_BACKEND_URL}/service-provider/updateProfile', profile, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      alert('Profile updated successfully!');
      setIsEditing(false); // Exit edit mode after saving
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };
  useEffect(() => {
    const fetchCategoriesAndServices = async () => {
      try {
        const categoriesResponse = await axios.get('${VITE_BACKEND_URL}/categories');
        const fetchedCategories = categoriesResponse.data;
        setCategories(fetchedCategories);

        // Fetch services for each category
        const servicesData = {};
        for (const category of fetchedCategories) {
          const servicesResponse = await axios.get(`${VITE_BACKEND_URL}/services/${category.category_id}`);
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


  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = {
        services: newSelectedServices.map((serviceId) => ({
          serviceId,
          available: true, // Default availability to true
        })),
      };

      const response = await axios.post('${VITE_BACKEND_URL}/service-provider/preferences', data, {
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



  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('${VITE_BACKEND_URL}/service-provider/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    if (activeTab === 'services' || activeTab === 'add-services') {
      const fetchServices = async () => {
        try {
          const response = await axios.get('${VITE_BACKEND_URL}/service-provider/services', {
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

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Mark a service as unavailable
  const handleToggleAvailability = async (serviceId, currentAvailability) => {
    try {
      const newAvailability = !currentAvailability; // Toggle the current availability status
      await axios.put(`${VITE_BACKEND_URL}/service-provider/updateAvailability/${serviceId}`, { available: newAvailability }, {
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

  // Remove a service completely
  const handleRemoveService = async (serviceId) => {
    try {
      await axios.delete(`${VITE_BACKEND_URL}/service-provider/removeService/${serviceId}`, {
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



  return (
    <div>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@4.1.3/dist/css/bootstrap.min.css"
        integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO"
        crossorigin="anonymous"
      />
      <div className="tab-container" id='fixed'>
        <button
          className={activeTab === 'profile' ? 'active' : ''}
          id='middle'
          onClick={() => handleTabChange('profile')}
        >
          Profile
        </button>
        <button
          className={activeTab === 'services' ? 'active' : ''}
          id='middle'
          onClick={() => handleTabChange('services')}
        >
          Services Offered
        </button>
        <button
          className={activeTab === 'add-services' ? 'active' : ''}
          id='middle'
          onClick={() => handleTabChange('add-services')}
        >
          Add New Services
        </button>
      </div>

      {/* Conditional rendering based on the active tab */}
      {activeTab === 'profile' && profile && (
        <div className="profile-container shadow p-3 mb-5 bg-body-tertiary rounded">
          <h1 className="profile-header">Service Provider Profile</h1>
          <hr />
          <div className="row">
            <div className="col-3 border-right text-center">
              <div className='image-adjust'>
              <img
                className="rounded-circle profile-image"
                width="150px"
                src="https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
                alt="Profile"
              />
              </div>
              <h4>{profile.firstName} {profile.lastName}</h4>
            </div>
            <div className="col-9">
              <div className="profile-details">
                <div className="row">
                  <div className="col-6">
                    <p><strong>Name:</strong></p>
                    {isEditing ? (
                      <div className="name-inputs">
                        <input
                          type="text"
                          name="firstName"
                          value={profile.firstName}
                          onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                        />
                        <input
                          type="text"
                          name="lastName"
                          value={profile.lastName}
                          onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                        />
                      </div>
                    ) : (
                      `${profile.firstName} ${profile.lastName}`
                    )}
                  </div>
                  <div className="col-6">
                    <p><strong>Phone:</strong></p>
                    {isEditing ? (
                      <input
                        type="text"
                        name="phone"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      />
                    ) : (
                      profile.phone
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="col-6">
                    <p><strong>Address:</strong></p>
                    {isEditing ? (
                      <input
                        type="text"
                        name="address"
                        value={profile.address}
                        onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                      />
                    ) : (
                      profile.address
                    )}
                  </div>
                  <div className="col-6">
                    <p><strong>City:</strong></p>
                    {isEditing ? (
                      <input
                        type="text"
                        name="city"
                        value={profile.city}
                        onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                      />
                    ) : (
                      profile.city
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="col-6">
                    <p><strong>Gender:</strong></p>
                    {isEditing ? (
                      <select
                        name="gender"
                        value={profile.gender}
                        onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    ) : (
                      profile.gender
                    )}
                  </div>
                  <div className="col-6">
                    <p><strong>Date of Birth:</strong></p>
                    {isEditing ? (
                      <input
                        type="date"
                        name="dob"
                        value={profile.dob}
                        onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                      />
                    ) : (
                      profile.dob
                    )}
                  </div>
                </div>

                {isEditing ? (
                  <button className="btn btn-success profile-button" onClick={handleSaveProfile}>Save Changes</button>
                ) : (
                  <button className="btn btn-primary profile-button" onClick={() => setIsEditing(true)}>Edit Profile</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}


      {
        activeTab === 'services' && (
          <div className="services-container shadow p-3 mb-5 bg-body-tertiary rounded">
            <h1 className="profile-header">Services Offered</h1>
            <hr></hr>

            {services.map((service) => (
              <div key={service.sp_service_id} className="service-item">
                <p>
                  <strong>Service:</strong> {service.service_name}
                </p>
                <p>
                  <strong>Category:</strong> {service.category_name}
                </p>
                <label>
                  Available:
                  <input
                    type="checkbox"
                    checked={Boolean(service.availability_status)}
                    onChange={() => handleToggleAvailability(service.service_id, service.availability_status)} // Pass the current state to the handler
                  />
                </label>
                <button type="button" className="btn btn-danger" onClick={() => handleRemoveService(service.service_id)}>
                  Remove
                </button>
              </div>
            ))}


          </div>
        )}
      {activeTab === "add-services" && (
        <div className='preferences'>
          <div className="container shadow p-3 mb-5 bg-body-tertiary rounded">
            <h1 className="profile-header">Service Provider Preferences</h1>
            <hr></hr>
            <form onSubmit={handleSubmit}>
              <div className="row">
                {/* Render categories and their services */}
                {categories.map((category) => (
                  <div key={category.category_id} className="col-md-4 mb-3">
                    <div className="list-group">
                      <h3 className="list-group-item list-group-item-action active"
                        style={{ backgroundColor: "#A4EBF3", color: "black", border: "2px solid black" }}>

                        {category.name}
                      </h3>
                      {servicesByCategory[category.category_id] &&
                        servicesByCategory[category.category_id].map((service) => (
                          <label
                            key={service.service_id}
                            className="list-group-item d-flex gap-1"
                          >
                            {/* Check if service is already selected */}
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

              {/* Submit Button */}
              <div className='savepref'>
              <button type="submit" className="btn"
              >
                Save Preferences
              </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <script
        src="https://code.jquery.com/jquery-3.3.1.slim.min.js"
        integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo"
        crossorigin="anonymous"
      ></script>
      <script
        src="https://cdn.jsdelivr.net/npm/popper.js@1.14.3/dist/umd/popper.min.js"
        integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49"
        crossorigin="anonymous"
      ></script>
      <script
        src="https://cdn.jsdelivr.net/npm/bootstrap@4.1.3/dist/js/bootstrap.min.js"
        integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy"
        crossorigin="anonymous"
      ></script>

    </div>
  );
};

export default SpProfile;