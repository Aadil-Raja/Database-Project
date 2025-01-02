import React, { useState } from 'react';
import './Add-Category.css';  // Importing the CSS file
import axios from 'axios';

const AddCategory = () => {
  // State to hold form values
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');

  // State to display success message after form submission
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Handler to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

   
      

    try {
      // Send POST request to the backend with correct field names
      const response = await axios.post("${VITE_BACKEND_URL}/Add-Category", { 
        title: categoryName, 
        description: categoryDescription 
      },{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      
      if (response.data.message === `Category added successfully`) {
        setSuccessMessage('Category Request sent!');
        setCategoryName('');
        setCategoryDescription('');
        setErrorMessage('');
      } else {
        setErrorMessage('Failed to add category.');
      }
    } catch (error) {
      console.error('Error submitting category:', error);
      setErrorMessage('Error adding category, please try again later.');
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Add New Category</h1>

      {successMessage && (
        <div className="success-message">
          <strong>{successMessage}</strong>
        </div>
      )}

      {errorMessage && (
        <div className="error-message">
          <strong>{errorMessage}</strong>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="form-label">Category Name</label>
          <input
            type="text"
            className="form-input"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Enter category name"
            required
          />
        </div>

        <div>
          <label className="form-label">Category Description</label>
          <textarea
            className="form-textarea"
            value={categoryDescription}
            onChange={(e) => setCategoryDescription(e.target.value)}
            placeholder="Enter category description"
          ></textarea>
        </div>

        <button type="submit" className="form-button">
          Add Category
        </button>
      </form>
    </div>
  );
};

export default AddCategory;
