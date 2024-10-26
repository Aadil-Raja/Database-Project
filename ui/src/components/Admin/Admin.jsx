import React, { useState, useEffect } from 'react';
import './Admin.css';
import axios from 'axios';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBTypography,
  MDBInputGroup,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBBtn,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBInput,
  MDBFile,
  MDBListGroup,
  MDBListGroupItem,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalBody,
MDBModalTitle,
} from 'mdb-react-ui-kit';


const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('Requests');

  const [requests, setRequests] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [newService, setNewService] = useState({ name: '', description: '', category_id: null });
  const [currentcategories, setcurrentCategories] = useState([]);
  const [categoryImg, setcategoryImg] = useState(null);
  const [serviceImg, setserviceImg] = useState(null);
  const [servicesByCategory, setServicesByCategory] = useState({});
  const[payments,setPayments]=useState([]);

  async function getFileUrl(baseUrl, fileName) {
    const possibleExtensions = ['.png', '.jpeg', '.jpg', '.gif', '.pdf'];
    for (let ext of possibleExtensions) {
      const fileUrl = `${baseUrl}/${fileName}${ext}`;
      try {
        const response = await fetch(fileUrl, { method: 'HEAD' });
        if (response.ok) {
          return fileUrl;
        }
      } catch (error) {
        console.error(`Error fetching ${fileUrl}:`, error);
      }
    }
    return null;
  }
  
  // DynamicImageLoader Component
  const DynamicImageLoader = ({ proof_of_payment }) => {
    const [fileSrc, setFileSrc] = useState(null);
    const [showModal, setShowModal] = useState(false); // State for handling the modal

    const toggleModal = () => setShowModal(!showModal); // Function to toggle modal
  
    useEffect(() => {
      const fetchFile = async () => {
        console.log(proof_of_payment);
        const baseUrl = 'http://localhost:3000/payments'; // Base URL for file storage
        const result = await getFileUrl(baseUrl, proof_of_payment);
        setFileSrc(result);
      };
      fetchFile();
    }, [proof_of_payment]);
  
    if (!fileSrc) {
      return <p>File not found or still loading...</p>;
    }
  
    return (
      <>
        <td onClick={toggleModal} style={{ cursor: 'pointer' }}>
          {fileSrc.endsWith('.pdf') ? (
            <a href={fileSrc} target="_blank" rel="noopener noreferrer">
              View PDF
            </a>
          ) : (
            <img src={fileSrc} alt="Proof of Payment" className="category-icon" />
          )}
        </td>
  
        {/* Modal for showing the full-size image or PDF */}
        <MDBModal open={showModal} setShow={setShowModal} tabIndex="-1">
          <MDBModalDialog>
            <MDBModalContent>
              <MDBModalHeader>
                <MDBModalTitle>Proof of Payment</MDBModalTitle>
                <button type="button" className="btn-close" aria-label="Close" onClick={toggleModal}></button>
              </MDBModalHeader>
              <MDBModalBody>
                {fileSrc.endsWith('.pdf') ? (
                  <iframe src={fileSrc} title="Proof of Payment PDF" width="100%" height="600px"></iframe>
                ) : (
                  <img src={fileSrc} alt="Proof of Payment" style={{ width: '100%' }} />
                )}
              </MDBModalBody>
            </MDBModalContent>
          </MDBModalDialog>
        </MDBModal>
      </>
    );
  };
  

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
    fetchpayments();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get('http://localhost:3000/admin');
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };
  const fetchpayments = async () => {
    try {
      const response = await axios.get('http://localhost:3000/getPendingPayments');
      setPayments(response.data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };
  const handleApprove = async (id) => {
    alert(id);
    setRequests((prevRequests) =>
      prevRequests.filter((req) => req.id !== id)
    );
    await axios.delete(`http://localhost:3000/removeReqCategories/${id}`)
   

    alert(`Approved request with ID: ${id}`);
  };

  const handleReject = async(id) => {
    setRequests((prevRequests) =>
      prevRequests.filter((req) => req.id !== id)
    );
    await axios.delete(`http://localhost:3000/removeReqCategories/${id}`)
   

    alert(`Rejected request with ID: ${id}`);
  };
  const handlePaidPayment = async(id) => {
    setPayments((prevPayments) =>
      prevPayments.filter((payment) => payment.payment_id !== id)
    );
    alert(`Payment Marked as Paid: ${id}`);

    await axios.put(`http://localhost:3000/updatePaymentStatus/${id}`)
   

    
  };
  
  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', newCategory.name);
      formData.append('description', newCategory.description);
      formData.append('categoryImg', categoryImg);
      const response = await axios.post('http://localhost:3000/Addcategories', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data === 'Successful') {
        alert('Category Added Successfully');
      }
    } catch (error) {
      alert('Failed to add category');
    }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', newService.name);
      formData.append('description', newService.description);
      formData.append('category_id', newService.category_id);
      formData.append('serviceImg', serviceImg);

      const response = await axios.post('http://localhost:3000/AddService', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data === 'Successful') {
        alert('Service Added Successfully');
      }
    } catch (error) {
      alert('Failed to add service');
    }
  };

  const handleTabChange = (value) => {
    if (value === activeTab) {
      return;
    }
    setActiveTab(value);
  };

  return (
    <MDBContainer fluid className="admin-dashboard-container">
      <MDBTabs className="mb-3 admin-tabs">
        <MDBTabsItem>
          <MDBTabsLink onClick={() => handleTabChange('Requests')} active={activeTab === 'Requests'}>
            <MDBIcon fas icon="clipboard-list" className="me-2" /> Pending Requests
          </MDBTabsLink>
        </MDBTabsItem>
        <MDBTabsItem>
          <MDBTabsLink
            onClick={() => handleTabChange('CurrentCategory&Services')}
            active={activeTab === 'CurrentCategory&Services'}
          >
            <MDBIcon fas icon="list" className="me-2" /> Categories & Services
          </MDBTabsLink>
        </MDBTabsItem>
        <MDBTabsItem>
          <MDBTabsLink onClick={() => handleTabChange('AddCategory')} active={activeTab === 'AddCategory'}>
            <MDBIcon fas icon="plus-circle" className="me-2" /> Add Category
          </MDBTabsLink>
        </MDBTabsItem>
        <MDBTabsItem>
          <MDBTabsLink onClick={() => handleTabChange('AddService')} active={activeTab === 'AddService'}>
            <MDBIcon fas icon="plus-square" className="me-2" /> Add Service
          </MDBTabsLink>
        </MDBTabsItem>
        <MDBTabsItem>
          <MDBTabsLink onClick={() => handleTabChange('Payment')} active={activeTab === 'Payment'}>
            <MDBIcon fas icon="dollar-sign" className="me-2" /> Payments
          </MDBTabsLink>
        </MDBTabsItem>
      </MDBTabs>
     
      <MDBTabsContent>
        {/* Pending Requests Tab */}
        <MDBTabsPane open={activeTab === 'Requests'}>
          <MDBCard className="mb-4">
            <MDBCardBody>
              <h3 className="mb-4">Pending Requests</h3>
              <MDBTable align="middle">
                <MDBTableHead>
                  <tr>
                    <th scope="col">Service Title</th>
                    <th scope="col">Description</th>
                    <th scope="col">Requested By</th>
                    <th scope="col">Actions</th>
                  </tr>
                </MDBTableHead>
                <MDBTableBody>
                  {requests.map((request) => (
                    <tr key={request.id}>
                      <td>{request.title}</td>
                      <td>{request.description}</td>
                      <td>{request.fullname}</td>
                      <td>
                        <MDBBtn color="success" size="sm" onClick={() => handleApprove(request.id)}>
                          Approve
                        </MDBBtn>{' '}
                        <MDBBtn color="danger" size="sm" onClick={() => handleReject(request.id)}>
                          Reject
                        </MDBBtn>
                      </td>
                    </tr>
                  ))}
                </MDBTableBody>
              </MDBTable>
            </MDBCardBody>
          </MDBCard>
        </MDBTabsPane>

        {/* Current Categories & Services Tab */}
        <MDBTabsPane open={activeTab === 'CurrentCategory&Services'}>
          <h3 className="mb-4">Categories and Services Offered</h3>
          <MDBRow>
            {currentcategories.map((category) => (
              <MDBCol md="4" key={category.category_id} className="mb-4">
                <MDBCard>
                  <MDBCardBody>
                    <h5 className="category-name">
                      <MDBIcon fas icon="folder" className="me-2" />
                      {category.name} ({category.status})
                    </h5>
                    <MDBTypography className="text-muted">{category.description}</MDBTypography>
                    <MDBListGroup className="mt-3">
                      {servicesByCategory[category.category_id] &&
                        servicesByCategory[category.category_id].map((service) => (
                          <MDBListGroupItem key={service.service_id}>
                            <MDBIcon fas icon="wrench" className="me-2" />
                            {service.name} ({service.status})
                          </MDBListGroupItem>
                        ))}
                    </MDBListGroup>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            ))}
          </MDBRow>
        </MDBTabsPane>

        {/* Add New Category Tab */}
        <MDBTabsPane open={activeTab === 'AddCategory'}>
          <MDBCard className="mb-4">
            <MDBCardBody>
              <h3 className="mb-4">Add New Category</h3>
              <form onSubmit={handleAddCategory}>
                <MDBInput
                  label="Category Name"
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  required
                  className="mb-4"
                />
                <MDBInput
                  label="Description"
                  type="text"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  className="mb-4"
                />
                <MDBFile label="Upload Category Image" onChange={handlecategoryFileChange} className="mb-4" />
                <MDBBtn type="submit">Add Category</MDBBtn>
              </form>
            </MDBCardBody>
          </MDBCard>
        </MDBTabsPane>

        {/* Add New Service Tab */}
        <MDBTabsPane open={activeTab === 'AddService'}>
          <MDBCard className="mb-4">
            <MDBCardBody>
              <h3 className="mb-4">Add New Service</h3>
              <form onSubmit={handleAddService}>
                <select
                  className="form-select mb-4"
                  value={newService.category_id || ''}
                  onChange={(e) => setNewService({ ...newService, category_id: e.target.value })}
                  required
                >
                  <option value="">Select Category</option>
                  {currentcategories.map((category) => (
                    <option key={category.category_id} value={category.category_id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <MDBInput
                  label="Service Name"
                  type="text"
                  value={newService.name}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  required
                  className="mb-4"
                />
                <MDBInput
                  label="Description"
                  type="text"
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  className="mb-4"
                />
                <MDBFile label="Upload Service Image" onChange={handleserviceFileChange} className="mb-4" />
                <MDBBtn type="submit">Add Service</MDBBtn>
              </form>
            </MDBCardBody>
          </MDBCard>
        </MDBTabsPane>
        <MDBTabsPane open={activeTab === 'Payment'}>
          <MDBCard className="mb-4">
            <MDBCardBody>
              <h3 className="mb-4">Pending Payments</h3>
              <MDBTable align="middle">
                <MDBTableHead>
                  <tr>
                    <th scope="col">Payment_ID</th>
                    <th scope="col">Full Name</th>
                    <th scope="col">SP_ID</th>
                    <th scope="col">Payment Proof</th>
                  <th scope="col">Actions</th>
                  </tr>
                </MDBTableHead>
                <MDBTableBody>
                  {payments.map((payment) => (
                    <tr key={payment.payment_id}>
                      <td>{payment.payment_id}</td>
                      <td>{payment.fullname}</td>
                      <td>{payment.sp_id}</td>
                      <DynamicImageLoader proof_of_payment={payment.proof_of_payment} />

                      <td>
                       
                        <MDBBtn color="danger" size="sm" onClick={() => handlePaidPayment(payment.payment_id)}>
                          Mark as Paid
                        </MDBBtn>
                      </td>
                    </tr>
                  ))}
                </MDBTableBody>
              </MDBTable>
            </MDBCardBody>
          </MDBCard>
        </MDBTabsPane>
      </MDBTabsContent>
    </MDBContainer>
  );
};

export default AdminDashboard;
