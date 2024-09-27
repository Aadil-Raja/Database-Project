import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./SpProfile.css";

const SpProfile = () => {
  const [activeTab, setActiveTab] = useState('profile'); // Control the active tab
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // Toggle for editing mode
  const [services, setServices] = useState([]); // Services offered by the service provider
  const [selectedServices, setSelectedServices] = useState([]); // For managing selected services

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:3000/service-provider/profile', {
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
    if (activeTab === 'services') {
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

  const handleTabChange = (tab) => {
    setActiveTab(tab);
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

  // Remove a service completely
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

  

  return (
    <div>
      <div className="tab-container">
        <button
          className={activeTab === 'profile' ? 'active' : ''}
          onClick={() => handleTabChange('profile')}
        >
          Profile
        </button>
        <button
          className={activeTab === 'services' ? 'active' : ''}
          onClick={() => handleTabChange('services')}
        >
          Services Offered
        </button>
      </div>

      {/* Conditional rendering based on the active tab */}
      {activeTab === 'profile' && profile && (
        <div className="profile-container">
          <h2>Service Provider Profile</h2>
          <div className="profile-details">
            <p>
              <strong>Name:</strong>
              {isEditing ? (
                <>
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
                </>
              ) : (
                `${profile.firstName} ${profile.lastName}`
              )}
            </p>
<p>
              <strong>Phone:</strong>
              {isEditing ? (
                <input
                  type="text"
                  name="phone"
                  value={profile.phone}
                  onChange={handleInputChange}
                />
              ) : (
                profile.phone
              )}
            </p>

            <p>
              <strong>Address:</strong>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={profile.address}
                  onChange={handleInputChange}
                />
              ) : (
                profile.address
              )}
            </p>

            <p>
              <strong>City:</strong>
              {isEditing ? (
                <input
                  type="text"
                  name="city"
                  value={profile.city}
                  onChange={handleInputChange}
                />
              ) : (
                profile.city
              )}
            </p>

            <p>
              <strong>Gender:</strong>
              {isEditing ? (
                <select
                  name="gender"
                  value={profile.gender}
                  onChange={handleInputChange}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              ) : (
                profile.gender
              )}
            </p>

            <p>
              <strong>Date of Birth:</strong>
              {isEditing ? (
                <input
                  type="date"
                  name="dob"
                  value={profile.dob}
                  onChange={handleInputChange}
                />
              ) : (
                profile.dob
              )}
            </p>

            {isEditing ? (
              <button onClick={handleSaveProfile}>Save Changes</button>
            ) : (
              <button onClick={() => setIsEditing(true)}>Edit Profile</button>
            )}
          </div>
        </div>
      )}

      {activeTab === 'services' && (
        <div className="services-container">
          <h2>Services Offered</h2>
         
            {services.map((service) => (
              <div key={service.sp_service_id} className="service-item">
                <p>
                  <strong>Service:</strong> {service.service_name} - <strong>Category:</strong> {service.category_name}
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
    </div>
  );
};

export default SpProfile;