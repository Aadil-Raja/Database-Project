import React, { useState, useEffect } from 'react';
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBIcon,
  MDBTypography,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBBadge,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBInput,
  MDBFile,

} from 'mdb-react-ui-kit';
import axios from 'axios';
import './Spbilling.css'

const SpBilling = () => {
  const [invoices, setInvoices] = useState([]);
  const [spProfile, setSpProfile] = useState({});
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [proofFile, setProofFile] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [transactionDate, setTransactionDate] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  const percentageFee = 10; // 5% fee
  const BASE_URL = import.meta.env.VITE_BACKEND_URL ;

  useEffect(() => {
    fetchSpProfile();
    fetchInvoices();
  }, []);

  const fetchSpProfile = async () => {
    try {
      const spId = localStorage.getItem('user_ID');
      const response = await axios.get(`${BASE_URL}/sp/getprofile/${spId}`);
      setSpProfile(response.data);
    } catch (error) {
      console.error('Error fetching service provider profile:', error);
    }
  };
   
  // Fetch invoices from the backend
const fetchInvoices = async () => {
    try {
      const spId = localStorage.getItem('user_ID');
      const response = await axios.get(`${BASE_URL}/sp/invoices/${spId}`);
      setInvoices(response.data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };
  
  

  const handleUploadProof = (invoice) => {
    setSelectedInvoice(invoice);
    setShowUploadModal(true);
  };

  const handleProofSubmit = async (e) => {
    e.preventDefault();
    if (!proofFile ) {

      setAlertMessage('Please fill in all fields and select a file.');
      setAlertVariant('danger');
      return;
    }

    setLoading(true);

    try {
      // Simulate upload
      setTimeout(() => {
        setAlertMessage('Proof of payment uploaded successfully.');
        setAlertVariant('success');
        setShowUploadModal(false);
        setProofFile(null);
        setTransactionId('');
        setTransactionDate('');
        setLoading(false);

        // // Update invoice status to 'Paid'
    //     setInvoices((prevInvoices) =>
    //       prevInvoices.map((invoice) =>
    //         invoice.payment_id === selectedInvoice.payment_id
    //           ? { ...invoice, status: 'uploaded' }
    //           : invoice
    //       )
    //    );
      }, 1000);
      const formData = new FormData();
      formData.append('payment_id',selectedInvoice.payment_id);
      formData.append('sp_id',selectedInvoice.sp_id);
      formData.append('folder', 'payments');
      formData.append('proofOfPayment', proofFile);
     
      const response = await axios.put(`${BASE_URL}/sp/invoice/payment`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      window.location.reload();
    } catch (error) {
      console.error('Error uploading proof of payment:', error);
      setAlertMessage('Error uploading proof of payment. Please try again.');
      setAlertVariant('danger');
      setLoading(false);
    }
  };

  const handleViewInvoice = async (invoice) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/sp/invoiceDetails/${invoice.payment_id}`
      );
      setSelectedInvoice(response.data);
      setCompletedOrders(response.data.orders);
      setShowInvoiceModal(true);
    } catch (error) {
      console.error('Error fetching invoice details:', error);
    }
  };
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <MDBBadge color="warning">Pending</MDBBadge>;
      case 'Paid':
        return <MDBBadge color="success">Paid</MDBBadge>;
      case 'Overdue':
        return <MDBBadge color="danger">Overdue</MDBBadge>;
        case 'uploaded':
        return <MDBBadge color="warning">Pending</MDBBadge>;
      default:
        return <MDBBadge color="secondary">Unknown</MDBBadge>;
    }
  };
  

  const handleCreatePayment = async (invoice) => {
    try {
      const spId = localStorage.getItem('user_ID');
  
      
      const response = await axios.post(`${BASE_URL}/api/sp/payment`, {
        invoice});
  
      
    } catch (error) {
      console.error('Error creating payment record:', error);
    }
  };
  
  const shouldShowPayButton = (invoice) => {
    return  (invoice.status!='paid' && invoice.proof_of_payment == null);
  };
  
  
  return (
    <MDBContainer className="py-5 spbilling-section">
      <h2 className="mb-4 text-center">Billing</h2>

{invoices.length > 0 ? (
  <MDBTable striped bordered responsive>
    <MDBTableHead>
      <tr>
        <th>#</th>
        <th>Billing Month</th>
        <th>Total Earnings</th>
        <th>Amount Payable</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    </MDBTableHead>
    <MDBTableBody>
      {invoices.map((invoice, index) => (
        <tr key={invoice.payment_id}>
          <td>{index + 1}</td>
          <td>
            {new Date(invoice.billing_year, invoice.billing_month - 1).toLocaleString(
              'default',
              { month: 'long', year: 'numeric' }
            )}
          </td>
          <td>${parseFloat(invoice.total_earnings).toFixed(2)}</td>
          <td>${parseFloat(invoice.amount_due).toFixed(2)}</td>
          <td>{getStatusBadge(invoice.status)}</td>
          <td>
            <MDBBtn
              size="sm"
              color="info"
              onClick={() => handleViewInvoice(invoice)}
            >
              View Bill
            </MDBBtn>{' '}
            {shouldShowPayButton(invoice) && (
              <MDBBtn
                size="sm"
                color="primary"
                onClick={() => handleUploadProof(invoice)}
              >
                Pay Now
              </MDBBtn>
            )}
          </td>
        </tr>
      ))}
    </MDBTableBody>
  </MDBTable>
) : (
  <p className="text-center">No invoices found.</p>
)}


    
         {/* View Invoice Modal */}
      {selectedInvoice && (
        <MDBModal
          open={showInvoiceModal}
          setShow={setShowInvoiceModal}
          tabIndex="-1"
          staticBackdrop
          size="lg"
        >
          <MDBModalDialog centered size="lg">
            <MDBModalContent>
              <MDBModalHeader>
                <MDBModalTitle>Invoice Details</MDBModalTitle>
                <MDBBtn
                  className="btn-close"
                  color="none"
                  onClick={() => setShowInvoiceModal(false)}
                ></MDBBtn>
              </MDBModalHeader>
              <MDBModalBody>
                <MDBCard className="p-4">
                  <MDBCardBody>
                    <MDBContainer className="mb-2 mt-3">
                      <MDBRow className="d-flex align-items-baseline">
                        <MDBCol xl="9">
                          <p style={{ color: '#7e8d9f', fontSize: '20px' }}>
                            Invoice &gt; &gt;{' '}
                            <strong>ID: #{`${selectedInvoice.sp_id}-${selectedInvoice.payment_id}-${selectedInvoice.billing_month}-${selectedInvoice.billing_year}`}</strong>
                          </p>
                        </MDBCol>
                        
                      </MDBRow>
                    </MDBContainer>
                   
                    <MDBRow>
                      <MDBCol xl="8">
                        <MDBTypography listUnStyled>
                          <li className="text-muted">
                            To:{' '}
                            <span style={{ color: '#5d9fc5' }}>
                              {spProfile.fullname}
                            </span>
                          </li>
                          <li className="text-muted">{spProfile.address}</li>
                          <li className="text-muted">{spProfile.city}</li>
                          <li className="text-muted">
                            <MDBIcon fas icon="phone-alt" /> {spProfile.phone}
                          </li>
                        </MDBTypography>
                      </MDBCol>
                      <MDBCol xl="4">
                        
                        <MDBTypography listUnStyled>
                       
                          
                          <li className="text-muted">
                            <MDBIcon fas icon="circle" style={{ color: '#84B0CA' }} />
                            <span className="fw-bold ms-1">Status:</span>
                            {getStatusBadge(selectedInvoice.status)}
                          </li>
                        </MDBTypography>
                      </MDBCol>
                    </MDBRow>
                    <MDBRow className="my-2 mx-1 justify-content-center">
                      <MDBTable striped borderless>
                        <MDBTableHead
                          className="text-white"
                          style={{ backgroundColor: '#84B0CA' }}
                        >
                          <tr>
                            <th scope="col">#</th>
                            <th scope="col">Service</th>
                            <th scope="col">Client</th>
                            <th scope="col">Address</th>
                            <th scope="col">Date Completed</th>
                            <th scope="col">Price</th>
                          </tr>
                        </MDBTableHead>
                        <MDBTableBody>
                          {completedOrders.map((order, idx) => (
                            <tr key={idx}>
                              <th scope="row">{idx + 1}</th>
                              <td>{order.service_name}</td>
                              <td>{order.client_name}</td>
                              <td>{order.address}</td>
                              <td>
                                {new Date(order.completed_date).toLocaleDateString()}
                              </td>
                              <td>${order.price}</td>
                            </tr>
                          ))}
                        </MDBTableBody>
                      </MDBTable>
                    </MDBRow>
                    <MDBRow>
                      <MDBCol xl="8">
                        <p className="ms-3">Please make the payment by the due date.</p>
                      </MDBCol>
                      <MDBCol xl="3">
                        <MDBTypography listUnStyled>
                          <li className="text-muted ms-3">
                            <span className="text-black me-4">SubTotal</span>$
                            {selectedInvoice.total_earnings}
                          </li>
                          <li className="text-muted ms-3 mt-2">
                            <span className="text-black me-4">
                              {percentageFee}% Service Fee:
                            </span>$
                            {selectedInvoice.amount_due}
                          </li>
                        </MDBTypography>
                        <p className="text-black float-start">
                          <span className="text-black me-3">Total Amount</span>
                          <span style={{ fontSize: '25px' }}>
                            $
                            {selectedInvoice.amount_due}
                          </span>
                        </p>
                      </MDBCol>
                    </MDBRow>
                    <hr />
                    <MDBRow>
                      <MDBCol xl="12">
                        <p>Thank you for your cooperation.</p>
                      </MDBCol>
                    </MDBRow>
                  </MDBCardBody>
                </MDBCard>
              </MDBModalBody>
              <MDBModalFooter>
                <MDBBtn color="secondary" onClick={() => setShowInvoiceModal(false)}>
                  Close
                </MDBBtn>
              </MDBModalFooter>
            </MDBModalContent>
          </MDBModalDialog>
        </MDBModal>
      )}
      {/* Upload Proof of Payment Modal */}
      {selectedInvoice && (
        <MDBModal
          open={showUploadModal}
          setShow={setShowUploadModal}
          tabIndex="-1"
          staticBackdrop
        >
          <MDBModalDialog centered>
            <MDBModalContent>
              <form onSubmit={handleProofSubmit}>
                <MDBModalHeader>
                  <MDBModalTitle>Upload Proof of Payment</MDBModalTitle>
                  <MDBBtn
                    className="btn-close"
                    color="none"
                    onClick={() => setShowUploadModal(false)}
                  ></MDBBtn>
                </MDBModalHeader>
                <MDBModalBody>

                  <div className="mb-3">
                    <MDBFile
                      label="Proof of Payment"
                      id="formProofFile"
                      onChange={(e) => setProofFile(e.target.files[0])}
                      required
                    />
                    <small className="text-muted">
                      Accepted formats: JPG, PNG, PDF. Max size: 5MB.
                    </small>
                  </div>
                </MDBModalBody>
                <MDBModalFooter>
                  <MDBBtn color="secondary" onClick={() => setShowUploadModal(false)}>
                    Cancel
                  </MDBBtn>
                  <MDBBtn color="primary" type="submit" disabled={loading}>
                    {loading ? 'Uploading...' : 'Submit'}
                  </MDBBtn>
                </MDBModalFooter>
              </form>
            </MDBModalContent>
          </MDBModalDialog>
        </MDBModal>
      )}
    </MDBContainer>
  );
};

export default SpBilling;
