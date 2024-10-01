import React, { useState, useEffect } from 'react';
import './Admin.css';

const AdminDashboard = () => {
  const [categories, setCategories] = useState([]);
  const [requests, setRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });

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
    // Handle request approval (make an API call)
    alert(`Approved request with ID: ${id}`);
  };

  const handleReject = (id) => {
    // Handle request rejection (make an API call)
    alert(`Rejected request with ID: ${id}`);
  };

  //main categories table me add wala kaam yahan hoga
  // const handleAddCategory = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await fetch('/api/admin/categories', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(newCategory),
  //     });
  //     const data = await response.json();
  //     setCategories([...categories, data]); // Update the category list
  //     setShowModal(false); // Close modal after submission
  //   } catch (error) {
  //     alert('Failed to add category');
  //   }
  // }; 

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      {/* Manage Categories Section */}
      <div className="categories-section">
        <h2>Manage Categories</h2>
        <ul>
          {categories.map((category) => (
            <li key={category.category_id}>{category.name}</li>
          ))}
        </ul>
        <button onClick={() => setShowModal(true)}>Add New Category</button>
      </div>

      {/* Pending Requests Section */}
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

      {/* Add Category Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
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
              <button type="submit">Add Category</button>
              <button type="button" onClick={() => setShowModal(false)}>Close</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
