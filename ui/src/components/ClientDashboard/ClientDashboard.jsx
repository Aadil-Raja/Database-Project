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
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBContainer,
  MDBRow,
  MDBCol,
} from 'mdb-react-ui-kit';
import axios from 'axios';
const ClientDashboard = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [orders, setOrders] = useState({
    pending: [],
    accepted: [],
    completed: [],
  });

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
      // Assuming data is an array of orders with a 'status' field
      const pendingOrders = data.filter((order) => order.status === 'pending');
      const acceptedOrders = data.filter((order) => order.status === 'accepted');
      const completedOrders = data.filter((order) => order.status === 'completed');

      setOrders({
        pending: pendingOrders,
        accepted: acceptedOrders,
        completed: completedOrders,
      });
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

    await updateOrderStatus(orderId, 'completed');
   
  
  };

  const handleProvideFeedback = (orderId) => {

    alert(`Providing feedback for order ID: ${orderId}`);

  };

  const updateOrderStatus = async (orderId, status) => {
    try {
       
       
      await axios.put(`http://localhost:3000/client/orders/${orderId}`,{status}
     
      );
      
    } catch (error) {
      console.error(`Error updating order status to ${status}:`, error);
    }
  };

  return (
    <MDBContainer className="mt-5">
      <h2 className="mb-4 text-center">My Requests</h2>
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
            <OrderTable
              orders={orders.pending}
              status="pending"
              onCancel={handleCancelOrder}
              activeTab={activeTab}
            />
          ) : (
            <p className="text-center">No pending orders.</p>
          )}
        </MDBTabsPane>

        {/* Accepted Orders */}
        <MDBTabsPane open={activeTab === 'accepted'}>
          {orders.accepted.length > 0 ? (
            <OrderTable
              orders={orders.accepted}
              status="accepted"
              onComplete={handleCompleteOrder}
              activeTab={activeTab}
            />
          ) : (
            <p className="text-center">No accepted orders.</p>
          )}
        </MDBTabsPane>

        {/* Completed Orders */}
        <MDBTabsPane open={activeTab === 'completed'}>
          {orders.completed.length > 0 ? (
            <OrderTable
              orders={orders.completed}
              status="completed"
              onFeedback={handleProvideFeedback}
              activeTab={activeTab}
            />
          ) : (
            <p className="text-center">No completed orders.</p>
          )}
        </MDBTabsPane>
      </MDBTabsContent>
    </MDBContainer>
  );
};

// OrderTable Component
const OrderTable = ({ orders, status, onCancel, onComplete, onFeedback, activeTab }) => {
    const [showMore, setShowMore] = useState(false);
  // Function to toggle description
 

  return (
    <MDBTable align="middle">
      <MDBTableHead>
        <tr>
          <th scope="col">Order ID</th>
          <th scope="col">Service</th>
          <th scope="col">Description</th>
          <th scope="col">Address</th>
          <th scope="col">City</th>
          {activeTab!='pending' && (  <th scope="col">Service Provider</th>)}
        
          <th scope="col">Request Date</th>
          <th scope="col">Status</th>
          {activeTab==='completed' && (  <th scope="col">Completed Date</th>)}
          <th scope="col">Actions</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {orders.map((order,index) => (
          <tr key={index}>
            <td>{index+1}</td>
            <td>{order.name}</td>
            <td>
            {showMore ? order.description : `${order.description.substring(0, 30)}`}
            <MDBBtn size="sm" onClick={() => setShowMore(!showMore)}>{showMore ? "Show less": "Show More"}</MDBBtn>
            </td>
            <td>{order.address}</td>
            <td>{order.city}</td>
            
            {activeTab!='pending' &&( <td>{order.sp_name}</td>)}
            <td>{new Date(order.request_date).toLocaleDateString()}</td>
            <td>
              <MDBBadge color={getStatusColor(order.status)} pill>
                {capitalizeFirstLetter(order.status)}
              </MDBBadge>
            </td>
            {activeTab === 'completed' && (
  <td>
    {order.completed_date ? new Date(order.completed_date).toLocaleDateString() : ''}
  </td>
)}

            <td>
              {status === 'pending' && (
                <MDBBtn color="danger" size="sm" onClick={() => onCancel(order.request_id,index+1)}>
                  Cancel
                </MDBBtn>
              )}
              {status === 'accepted' && (
                <MDBBtn color="success" size="sm" onClick={() => onComplete(order.request_id,index+1)}>
                  Mark as Completed
                </MDBBtn>
              )}
              {status === 'completed' && (
                <MDBBtn color="info" size="sm" onClick={() => onFeedback(order.request_id,index+1)}>
                  Provide Feedback
                </MDBBtn>
              )}
              
            </td>
           
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
    case 'canceled':
      return 'danger';
    default:
      return 'dark';
  }
};

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export default ClientDashboard;
