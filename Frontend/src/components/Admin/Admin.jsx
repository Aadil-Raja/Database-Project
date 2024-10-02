import React, { useState, useEffect } from 'react';
import './Admin.css';
import axios from 'axios';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('Requests');

  const [requests, setRequests] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [newService, setNewService] = useState({ name: '', description: '' ,category_id:null});
  const [currentcategories, setcurrentCategories] = useState([]);
  const [categoryImg, setcategoryImg] = useState(null);
  const [serviceImg, setserviceImg] = useState(null);  
  const [servicesByCategory, setServicesByCategory] = useState({})
      
  const handlecategoryFileChange = (event) => {
    setcategoryImg(event.target.files[0]);
};
const handleserviceFileChange = (event) => {
  setserviceImg(event.target.files[0]);
};
  useEffect(() => {
    const fetchCategoriesAndServices = async () => {
      try {
        const categoriesResponse = await axios.get('http://localhost:3000/categories');
        const fetchedCategories = categoriesResponse.data;
        setcurrentCategories(fetchedCategories);

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

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const response = await fetch('http://localhost:3000/admin');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    setRequests(data);
  };

  const handleApprove = (id) => {
    alert(`Approved request with ID: ${id}`);
  };

  const handleReject = (id) => {
    alert(`Rejected request with ID: ${id}`);
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', newCategory.name); // Add the category name
      formData.append('description', newCategory.description); // Add the category description
      formData.append('categoryImg', categoryImg); 
      const response = await axios.post('http://localhost:3000/Addcategories', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Set the correct header for file upload
        },
      });
              if(response.data==="Successful")
              {
                alert("Added");
              }
   
    } catch (error) {
      alert('Failed to add category');
    }
  };
  const handleAddService = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', newService.name); // Add the category name
      formData.append('description', newService.description);
      formData.append('category_id', newService.category_id); 
      formData.append('serviceImg', serviceImg); 
      
      const response = await axios.post('http://localhost:3000/AddService', formData,{
        headers: {
          'Content-Type': 'multipart/form-data', // Set the correct header for file upload
        },
      });
      if(response.data==="Successful")
        {
          alert("Added");
        }
   
    } catch (error) {
      alert('Failed to add category');
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div>
      <div className="tab-container" id='fixed'>
        <button
          className={activeTab === 'Requests' ? 'active' : ''}
          id='middle'
          onClick={() => handleTabChange('Requests')}
        >
          Pending Requests
        </button>
        <button
          className={activeTab === 'CurrentCategory&Services' ? 'active' : ''}
          id='middle'
          onClick={() => handleTabChange('CurrentCategory&Services')}
        >
          Category and Services Offered
        </button>
        <button
          className={activeTab === 'AddCategory' ? 'active' : ''}
          id='middle'
          onClick={() => handleTabChange('AddCategory')}
        >
          Add New Category 
        </button>
        <button
          className={activeTab === 'AddService' ? 'active' : ''}
          id='middle'
          onClick={() => handleTabChange('AddService')}
        >
          Add New Service
        </button>
      </div>

      <div className="admin-dashboard">
   

        {activeTab === 'Requests' && (
          <div className="requests-section">
            <h2>Pending Requests</h2>
            <table>
              <thead>
                <tr>
                  <th>Service Title</th>
                  <th>Description</th>
                  <th>Requested By</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((request) => (
                  <tr key={request.id}>
                    <td>{request.title}</td>
                    <td>{request.description}</td>
                    <td>{request.fullname}</td>
                    <td>
                      <button onClick={() => handleApprove(request.id)}>Approve</button>
                      <button onClick={() => handleReject(request.id)}>Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'CurrentCategory&Services' && (
           <>
           <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.1.3/dist/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous"></link>
           <div className="container mt-5">
        
            
               <div className="row">
                 {/* Render categories and their services */}
                 {currentcategories.map((category) => (
                   <div key={category.category_id} className="col-md-4 mb-3">
                     <div className="list-group">
                       <h3 className="list-group-item list-group-item-action active">{category.name}</h3>
                       {servicesByCategory[category.category_id] && servicesByCategory[category.category_id].map((service) => (
                         <label key={service.service_id} className="list-group-item d-flex gap-2">
                        
                           <span>{service.name}</span>
                         </label>
                       ))}
                     </div>
                   </div>
                 ))}
               </div>
     
              
           
           </div>
           <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
           <script src="https://cdn.jsdelivr.net/npm/popper.js@1.14.3/dist/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>
           <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.1.3/dist/js/bootstrap.min.js" integrity="sha384-ChfqqxuZUCnJSK3+MXmPNIyE6ZbWh2IMqE241rYiqJxyMiZ6OW/JmZQ5stwEULTy" crossorigin="anonymous"></script>
         </>
        )}

        {activeTab === 'AddCategory' && (
          <div className="add-category-section">
            <h3>Add New Category</h3>
            <form onSubmit={handleAddCategory}>
              <label>
                Category Name:
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  required
                />
              </label>
              <label>
                Description:
                <input
                  type="text"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                />
              </label>
              <input type="file" onChange={handlecategoryFileChange} />
              <button type="submit">Add Category</button>
            </form>
          </div>
        )}
       {activeTab === 'AddService' && (
  <div className="add-category-section">
    <h3>Add New Service</h3>
    <form onSubmit={handleAddService}>
      {/* Dropdown for selecting a category */}
      <label>
        Select Category:
        <select
          value={newService.category_id} // Assuming you're storing the category_id in the newService state
          onChange={(e) => setNewService({ ...newService, category_id: e.target.value })}
          required
        >
          <option value="">Select a category</option> {/* Default option */}
          {currentcategories.map((category) => (
            <option key={category.category_id} value={category.category_id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Service Name:
        <input
          type="text"
          value={newService.name}
          onChange={(e) => setNewService({ ...newService, name: e.target.value })}
          required
        />
      </label>
      <label>
        Description:
        <input
          type="text"
          value={newService.description}
          onChange={(e) => setNewService({ ...newService, description: e.target.value })}
        />
      </label>
      <input type="file" onChange={handleserviceFileChange} />
      <button type="submit">Add Service</button>
    </form>
  </div>
)}

      </div>
    </div>
  );
};

export default AdminDashboard;
