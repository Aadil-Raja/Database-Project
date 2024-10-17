import React, { useState } from 'react';
import './Add-Category.css'; // Importing the CSS file
import axios from 'axios';
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBTextArea,
  MDBBtn,
  MDBTypography,
  MDBIcon,
} from 'mdb-react-ui-kit';

const AddCategory = () => {
  // State to hold form values
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');

  // State to display success or error messages after form submission
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Handler to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Send POST request to the backend with correct field names
      const response = await axios.post(
        'http://localhost:3000/Add-Category',
        {
          title: categoryName,
          description: categoryDescription,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.data.message === 'Category added successfully') {
        setSuccessMessage('Category request sent!');
        setCategoryName('');
        setCategoryDescription('');
        setErrorMessage('');
      } else {
        setErrorMessage('Failed to add category.');
        setSuccessMessage('');
      }
    } catch (error) {
      console.error('Error submitting category:', error);
      setErrorMessage('Error adding category, please try again later.');
      setSuccessMessage('');
    }
  };

  return (
    <MDBContainer className="add-category-container">
      <MDBCard className="my-5 add-category-card">
        <MDBCardBody>
          <MDBTypography tag="h3" className="mb-4 text-center">
            <MDBIcon fas icon="plus-circle" className="me-2" />
            Add New Category
          </MDBTypography>

          {successMessage && (
            <div className="alert alert-success add-category-alert">
              <strong>{successMessage}</strong>
            </div>
          )}

          {errorMessage && (
            <div className="alert alert-danger add-category-alert">
              <strong>{errorMessage}</strong>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <MDBInput
              label="Category Name"
              id="categoryName"
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Enter category name"
              required
              className="mb-4 add-category-input"
            />

            <MDBTextArea
              label="Category Description"
              id="categoryDescription"
              rows={4}
              value={categoryDescription}
              onChange={(e) => setCategoryDescription(e.target.value)}
              placeholder="Enter category description"
              className="mb-4 add-category-textarea"
            />

            <MDBBtn type="submit" block className="add-category-button">
              Add Category
            </MDBBtn>
          </form>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
};

export default AddCategory;
