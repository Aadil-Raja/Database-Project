import React, { useState, useEffect } from 'react';
import {
    MDBTabs,
    MDBTabsItem,
    MDBTabsLink,
    MDBTabsContent,
    MDBTabsPane,
    MDBTable,
    MDBTableHead,
    MDBTableBody,
    MDBBtn,
    MDBBadge,
    MDBIcon,
    MDBContainer,
    MDBModal,
    MDBModalDialog,
    MDBModalContent,
    MDBModalHeader,
    MDBModalTitle,
    MDBModalBody,
    MDBModalFooter,
    MDBSpinner,
    MDBTextArea,
    MDBProgress,
    MDBProgressBar,
    MDBTooltip,
    MDBCard,           // Added for summary cards
    MDBCardBody,       // Added for summary cards
    MDBRow,            // Added for layout
    MDBCol,            // Added for layout
} from 'mdb-react-ui-kit';
import axios from 'axios';
import './ClientDashboard.css'; // Make sure to update your CSS file accordingly

const StarRating = ({ rating, onRatingChange, readOnly = false }) => {
    return (
      <div>
        {[1, 2, 3, 4, 5].map((star) => (
          <MDBIcon
            key={star}
            icon="star"
            fas
            size="lg"
            style={{
              cursor: readOnly ? 'default' : 'pointer',
              color: star <= rating ? '#ffc107' : '#e4e5e9',
            }}
            onClick={() => !readOnly && onRatingChange && onRatingChange(star)}
          />
        ))}
      </div>
    );
  };

const ClientDashboard = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [orders, setOrders] = useState({
    pending: [],
    accepted: [],
    completed: [],
  });
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedbackOrderId, setFeedbackOrderId] = useState(null);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedback, setFeedback] = useState([]);

  // New state variables for summary counts
  const [totalRequests, setTotalRequests] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [acceptedCount, setAcceptedCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    // Fetch orders from your API and categorize them
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // Replace with your API endpoint
      const clientId = localStorage.getItem('user_ID'); // Assuming you store client ID in localStorage
      const response = await fetch(`http://localhost:3000/client/orders/${clientId}`);
      const data = await response.json();

      // Assuming data is an array of orders with a 'status' field
      const pendingOrders = data.filter((order) => order.status === 'pending');
      const acceptedOrders = data.filter((order) => order.status === 'accepted');
      const completedOrders = data.filter((order) => order.status === 'completed');

      setOrders({
        pending: pendingOrders,
        accepted: acceptedOrders,
        completed: completedOrders,
      });

      // Update summary counts
      setTotalRequests(data.length);
      setPendingCount(pendingOrders.length);
      setAcceptedCount(acceptedOrders.length);
      setCompletedCount(completedOrders.length);

    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleTabClick = (value) => {
    if (value === activeTab) {
      return;
    }
    setActiveTab(value);
  };

  const handleCancelOrder = async (orderId,index) => {
    alert(`Canceling order ID: ${index}`);
    setOrders((prevOrders) => ({
        ...prevOrders,
        pending: prevOrders.pending.filter((order) => order.request_id !== orderId),
      }));
    // Update counts
    setPendingCount((prev) => prev - 1);
    setTotalRequests((prev) => prev - 1);
    await updateOrderStatus(orderId, 'cancelled');
  };

  const handleCompleteOrder = async (orderId,index) => {
    alert(`Completing order ID: ${index}`);
    setOrders((prevOrders) => {
        // Find the completed order
        const completedOrder = prevOrders.accepted.find((order) => order.request_id === orderId);
        // Update the status locally
        const updatedOrder = { ...completedOrder, status: 'completed' };

        return {
          ...prevOrders,
          accepted: prevOrders.accepted.filter((order) => order.request_id !== orderId),
          completed: [...prevOrders.completed, updatedOrder],
        };
      });
    // Update counts
    setAcceptedCount((prev) => prev - 1);
    setCompletedCount((prev) => prev + 1);
    await updateOrderStatus(orderId, 'completed');
  };

  const handleProvideFeedback = (orderId) => {
    setFeedbackOrderId(orderId);
    setFeedbackModalOpen(true);
  };

  const handleFeedbackSubmit = async () => {
    try {
      // Send feedback to backend
      if (feedbackRating === 0 || !feedbackComment) {
        alert('Please provide all feedback details.');
        return;
      }
      setOrders((prevOrders) => ({
        ...prevOrders,
        completed: prevOrders.completed.map((order) =>
          order.request_id === feedbackOrderId
            ? { ...order, rating: feedbackRating, review: feedbackComment } // Update rating and review for the matched order
            : order // Return other orders unchanged
        ),
      }));
      // Close modal and reset feedback state
      setFeedbackModalOpen(false);
      setFeedbackOrderId(null);
      setFeedbackRating(0);
      setFeedbackComment('');

      alert('Feedback submitted successfully.');
      
      await axios.post('http://localhost:3000/client/feedback', {
        request_id: feedbackOrderId,
        rating: feedbackRating,
        comment: feedbackComment,
      });
       
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Error submitting feedback. Please try again.');
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(`http://localhost:3000/client/orders/${orderId}`, { status });
    } catch (error) {
      console.error(`Error updating order status to ${status}:`, error);
    }
  };

  return (
    <MDBContainer className="mt-5 client-dashboard-section">
      {/* Dashboard Header */}
      <div className="dashboard-header text-center mb-4">
        <h2 className="mb-3">Welcome to Your Dashboard</h2>
        <p className="lead">Here you can manage all your service requests and track their status.</p>
      </div>

      {/* Summary Cards */}
      <MDBRow className="mb-4">
        <MDBCol md="3">
          <MDBCard background="primary" className="text-white text-center mb-4">
            <MDBCardBody>
              <MDBIcon fas icon="clipboard-list" size="3x" className="mb-2" />
              <h5 className="card-title">Total Requests</h5>
              <h3>{totalRequests}</h3>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
        <MDBCol md="3">
          <MDBCard background="warning" className="text-white text-center mb-4">
            <MDBCardBody>
              <MDBIcon fas icon="hourglass-start" size="3x" className="mb-2" />
              <h5 className="card-title">Pending</h5>
              <h3>{pendingCount}</h3>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
        <MDBCol md="3">
          <MDBCard background="info" className="text-white text-center mb-4">
            <MDBCardBody>
              <MDBIcon fas icon="user-clock" size="3x" className="mb-2" />
              <h5 className="card-title">Accepted</h5>
              <h3>{acceptedCount}</h3>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
        <MDBCol md="3">
          <MDBCard background="success" className="text-white text-center mb-4">
            <MDBCardBody>
              <MDBIcon fas icon="check-circle" size="3x" className="mb-2" />
              <h5 className="card-title">Completed</h5>
              <h3>{completedCount}</h3>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>

      {/* Tabs */}
      <MDBTabs className="mb-3 justify-content-center">
        <MDBTabsItem>
          <MDBTabsLink onClick={() => handleTabClick('pending')} active={activeTab === 'pending'}>
            Pending Requests
          </MDBTabsLink>
        </MDBTabsItem>
        <MDBTabsItem>
          <MDBTabsLink onClick={() => handleTabClick('accepted')} active={activeTab === 'accepted'}>
            Accepted Requests
          </MDBTabsLink>
        </MDBTabsItem>
        <MDBTabsItem>
          <MDBTabsLink onClick={() => handleTabClick('completed')} active={activeTab === 'completed'}>
            Completed Requests
          </MDBTabsLink>
        </MDBTabsItem>
      </MDBTabs>

      <MDBTabsContent>
        {/* Pending Orders */}
        <MDBTabsPane open={activeTab === 'pending'}>
          {orders.pending.length > 0 ? (
            <>
              <div className="text-center mb-4">
                <MDBSpinner role="status" className="me-2" />
                <span>Your request is being processed. You will soon be contacted by a Service Provider.</span>
              </div>
              <OrderTable
                orders={orders.pending}
                status="pending"
                onCancel={handleCancelOrder}
                activeTab={activeTab}
              />
            </>
          ) : (
            <p className="text-center">No pending orders.</p>
          )}
        </MDBTabsPane>

        {/* Accepted Orders */}
        <MDBTabsPane open={activeTab === 'accepted'}>
          {orders.accepted.length > 0 ? (
            <>
              {/* Added an animation and message */}
              <div className="text-center mb-4">
                <MDBIcon fas icon="truck" size="3x" className="text-primary mb-2" />
                <h5>Your service provider is on the way!</h5>
              </div>
              <OrderTable
                orders={orders.accepted}
                status="accepted"
                onComplete={handleCompleteOrder}
                activeTab={activeTab}
              />
            </>
          ) : (
            <p className="text-center">No accepted orders.</p>
          )}
        </MDBTabsPane>

        {/* Completed Orders */}
        <MDBTabsPane open={activeTab === 'completed'}>
          {orders.completed.length > 0 ? (
            <>
              {/* Added a confirmation message */}
              <div className="text-center mb-4">
                <MDBIcon fas icon="check-circle" size="3x" className="text-success mb-2" />
                <h5>Your service has been completed!</h5>
                <p>Thank you for using our service.</p>
              </div>
              <OrderTable
                orders={orders.completed}
                status="completed"
                onFeedback={handleProvideFeedback}
                activeTab={activeTab}
              />
            </>
          ) : (
            <p className="text-center">No completed orders.</p>
          )}
        </MDBTabsPane>
      </MDBTabsContent>

      <MDBModal open={feedbackModalOpen} setShow={setFeedbackModalOpen} tabIndex="-1">
        <MDBModalDialog centered>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Provide Feedback</MDBModalTitle>
              <MDBBtn className="btn-close" color="none" onClick={() => setFeedbackModalOpen(false)}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <div className="mb-3">
                <label>Rating:</label>
                <StarRating rating={feedbackRating} onRatingChange={setFeedbackRating} />
              </div>
              <div className="mb-3">
                <label>Comment:</label>
                <MDBTextArea
                  rows={4}
                  value={feedbackComment}
                  onChange={(e) => setFeedbackComment(e.target.value)}
                />
              </div>
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color="secondary" onClick={() => setFeedbackModalOpen(false)}>
                Close
              </MDBBtn>
              <MDBBtn color="primary" onClick={handleFeedbackSubmit}>
                Submit Feedback
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </MDBContainer>
  );
};

// OrderTable Component
const OrderTable = ({ orders, status, onCancel, onComplete, onFeedback, activeTab }) => {
  const [expandedRows, setExpandedRows] = useState({});

  const toggleRow = (index) => {
    setExpandedRows((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <MDBTable align="middle" hover responsive striped>
      <MDBTableHead>
        <tr>
          <th scope="col">Order ID</th>
          <th scope="col">Service</th>
          <th scope="col">Description</th>
          <th scope="col">Address</th>
          <th scope="col">City</th>
          {activeTab !== 'pending' && <th scope="col">Service Provider</th>}
          <th scope="col">Request Date</th>
          <th scope="col">Status</th>
          {activeTab === 'completed' && <th scope="col">Completed Date</th>}
          {activeTab !== 'accepted' && <th scope="col">Actions</th>}
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {orders.map((order, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{order.name}</td>
            <td>
              {expandedRows[index] ? order.description : `${order.description.substring(0, 30)}...`}
              <MDBIcon
                icon={expandedRows[index] ? 'chevron-up' : 'chevron-down'}
                onClick={() => toggleRow(index)}
                style={{ cursor: 'pointer', color: '#007bff', marginLeft: '8px' }}
              />
            </td>
            <td>{order.address}</td>
            <td>{order.city}</td>
            {activeTab !== 'pending' && <td>{order.sp_name}</td>}
            <td>{new Date(order.request_date).toLocaleDateString()}</td>
            <td>
              <MDBBadge color={getStatusColor(order.status)} pill>
                {capitalizeFirstLetter(order.status)}
              </MDBBadge>
              {order.status === 'pending' && (
                <MDBSpinner size="sm" role="status" tag="span" className="ms-2" />
              )}
              {order.status === 'accepted' && (
                <MDBProgress className="mt-2" style={{ height: '6px' }}>
                  <MDBProgressBar width={50} valuemin={0} valuemax={100} />
                </MDBProgress>
              )}
            </td>
            {activeTab === 'completed' && (
              <td>
                {order.completed_date ? new Date(order.completed_date).toLocaleDateString() : ''}
              </td>
            )}
            {activeTab !== 'accepted' && (
              <td>
                {status === 'pending' && (
                  <MDBTooltip tag="span" title="Cancel this order">
                    <MDBBtn color="danger" size="sm" onClick={() => onCancel(order.request_id, index + 1)}>
                      Cancel
                    </MDBBtn>
                  </MDBTooltip>
                )}
                {status === 'completed' && order.review && order.rating && (
                  <div>
                    <StarRating rating={order.rating} readOnly={true} />
                    <p>{order.review}</p>
                  </div>
                )}
                {status === 'completed' && !order.rating && (
                  <MDBTooltip tag="span" title="Provide feedback for this service">
                    <MDBBtn color="info" size="sm" onClick={() => onFeedback(order.request_id)}>
                      Provide Feedback
                    </MDBBtn>
                  </MDBTooltip>
                )}
              </td>
            )}
          </tr>
        ))}
      </MDBTableBody>
    </MDBTable>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return 'warning';
    case 'accepted':
      return 'primary';
    case 'completed':
      return 'success';
    case 'cancelled':
      return 'danger';
    default:
      return 'dark';
  }
};

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export default ClientDashboard;
