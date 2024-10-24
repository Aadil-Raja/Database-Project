import React, { useState, useEffect } from 'react';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import {
  MDBBadge,
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBIcon,
} from 'mdb-react-ui-kit';
import axios from 'axios';

const SpHistory = () => {
  const [services, setServices] = useState({
    accepted: [],
    completed: [],
    cancelled: [],
  });
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('accepted');
  const [earningsByPeriod, setEarningsByPeriod] = useState({
    lastWeek: 0,
    lastMonth: 0,
    lastSixMonths: 0,
  });
  const [selectedPeriod, setSelectedPeriod] = useState('lastWeek');
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [overallTotalEarnings, setOverallTotalEarnings] = useState(0);
  const [spInfo, setSpInfo] = useState({
    firstName: '',
    lastName: '',
    averageRating: null, // Initialize as null
  });
  const [stats, setStats] = useState({
    accepted: 0,
    completed: 0,
    cancelled: 0,
  });

  useEffect(() => {
    fetchSpInfo();
    fetchServices();
  }, []);

  useEffect(() => {
    calculateEarnings();
    calculateOverallEarnings();
    updateStats();
  }, [services, selectedPeriod]); // Update when any part of services changes

  const fetchSpInfo = async () => {
    try {
      const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
      const response = await axios.get('http://localhost:3000/service-provider/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSpInfo(response.data);
    } catch (error) {
      console.error('Error fetching service provider info:', error);
    }
  };

  const fetchServices = async () => {
    try {
      const sp_id = localStorage.getItem('user_ID');
      const response = await axios.get(`http://localhost:3000/sp/orders/${sp_id}`);
      const orders = response.data;

      const cancelledOrders = orders.filter((order) => order.status === 'cancelled');
      const acceptedOrders = orders.filter((order) => order.status === 'accepted');
      const completedOrders = orders.filter((order) => order.status === 'completed');

      setServices({
        accepted: acceptedOrders,
        completed: completedOrders,
        cancelled: cancelledOrders,
      });

      // Extract reviews from completed orders
      const extractedReviews = completedOrders
        .filter((order) => order.rating && order.review)
        .map((order) => ({
          review_id: order.request_id,
          client_name: order.client_name,
          rating: order.rating,
          comment: order.review,
          service: order.name,
          created_at: order.review_date,

        }));

      setReviews(extractedReviews);

      // Simplify average rating calculation
      const avgRating = calculateAverageRating(extractedReviews);

      setSpInfo((prevInfo) => ({
        ...prevInfo,
        averageRating: avgRating,
      }));
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) {
      return null;
    }
  
    let totalRating = 0;
    for (let i = 0; i < reviews.length; i++) {
      totalRating += reviews[i].rating;
    }
  
    return (totalRating / reviews.length).toFixed(1);
  };
  
  const calculateEarnings = () => {
    const now = new Date();
    const earnings = {
      lastWeek: 0,
      lastMonth: 0,
      lastSixMonths: 0,
    };
  
    services.completed.forEach((service) => {
      const completedDate = new Date(service.completed_date);
  
      // Ensure the date parsing is correct
      if (isNaN(completedDate)) {
        console.error("Invalid date format:", service.completed_date);
        return;
      }
  
      const timeDiff = now - completedDate;
      const oneWeek = 7 * 24 * 60 * 60 * 1000;
      const oneMonth = 30 * 24 * 60 * 60 * 1000;
      const sixMonths = 6 * 30 * 24 * 60 * 60 * 1000;
  
      if (timeDiff <= oneWeek) earnings.lastWeek += parseFloat(service.price) || 0;  // Ensuring the value is a number
      if (timeDiff <= oneMonth) earnings.lastMonth += parseFloat(service.price) || 0;
      if (timeDiff <= sixMonths) earnings.lastSixMonths += parseFloat(service.price) || 0;
    });
  
    // Ensure the earnings are formatted to two decimal places
    earnings.lastWeek = earnings.lastWeek.toFixed(2);
    earnings.lastMonth = earnings.lastMonth.toFixed(2);
    earnings.lastSixMonths = earnings.lastSixMonths.toFixed(2);
  
    setEarningsByPeriod(earnings);
    setTotalEarnings(earnings[selectedPeriod]);
  };
  
  const calculateOverallEarnings = () => {
    let total = 0;
    services.completed.forEach(service => {
      total += parseFloat(service.price) || 0;  // Ensuring the value is a number
    });
  
    setOverallTotalEarnings(total.toFixed(2));  // Format to two decimal places
  };
  

  const updateStats = () => {
    setStats({
      accepted: services.accepted.length,
      completed: services.completed.length,
      cancelled: services.cancelled.length,
    });
  };

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    setTotalEarnings(earningsByPeriod[period]);
  };

  const handleTabClick = (value) => {
    if (value === activeTab) return;
    setActiveTab(value);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'accepted':
        return 'info';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  const capitalizeFirstLetter = (string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  };


  const handleMarkAsCompleted = async (orderId) => {
    try {
      // Update the orders state first
      setServices((prevServices) => {
        const completedOrder = prevServices.accepted.find(
          (order) => order.request_id === orderId
        );

        // Update the status locally
        const updatedOrder = {
          ...completedOrder,
          status: 'completed',
          completed_date: new Date().toISOString(),
        };

        const updatedAccepted = prevServices.accepted.filter(
          (order) => order.request_id !== orderId
        );
        const updatedCompleted = [...prevServices.completed, updatedOrder];

        return {
          ...prevServices,
          accepted: updatedAccepted,
          completed: updatedCompleted,
        };
      });

      // Then make the API call
      const status = 'completed';
      await axios.put(`http://localhost:3000/client/orders/${orderId}`, { status });
    } catch (error) {
      console.error('Error marking order as completed:', error);
      alert('Failed to mark order as completed.');
    }
  };

  return (
    <MDBContainer fluid className="SpHistory-container">
      <MDBRow>
        {/* Left Side - SP Info */}
        <MDBCol md="3" className="SpHistory-left">
          <MDBCard className="SpHistory-info-card mb-4">
            <MDBCardBody>
              <MDBCardTitle>{spInfo.firstName} {spInfo.lastName}</MDBCardTitle>

              <MDBCardText>
                <strong>Average Rating:</strong>{' '}
                {spInfo.averageRating !== null ? (
                  <>
                    {spInfo.averageRating}{' '}
                    <MDBIcon fas icon="star" className="text-warning" />
                  </>
                ) : (
                  'No reviews'
                )}
              </MDBCardText>
            </MDBCardBody>
          </MDBCard>

          {/* Earnings by Period */}
          <MDBCard className="SpHistory-earnings-card mb-4">
            <MDBCardBody>
              <MDBCardTitle>Earnings</MDBCardTitle>
              <div className="SpHistory-period-buttons mb-3">
                <MDBBtn
                  color={selectedPeriod === 'lastWeek' ? 'primary' : 'light'}
                  className="me-2 SpHistory-period-btn"
                  onClick={() => handlePeriodChange('lastWeek')}
                >
                  Last Week
                </MDBBtn>
                <MDBBtn
                  color={selectedPeriod === 'lastMonth' ? 'primary' : 'light'}
                  className="me-2 SpHistory-period-btn"
                  onClick={() => handlePeriodChange('lastMonth')}
                >
                  Last Month
                </MDBBtn>
                <MDBBtn
                  color={selectedPeriod === 'lastSixMonths' ? 'primary' : 'light'}
                  className="SpHistory-period-btn"
                  onClick={() => handlePeriodChange('lastSixMonths')}
                >
                  Last 6 Months
                </MDBBtn>
              </div>
              <MDBCardText>
                <strong>Total Earnings ({capitalizeFirstLetter(selectedPeriod)}):</strong> $
                {totalEarnings}
              </MDBCardText>
              <MDBCardText>
                <strong>Overall Earnings:</strong> ${overallTotalEarnings}
              </MDBCardText>
            </MDBCardBody>
          </MDBCard>

          {/* Real-time Stats */}
          <MDBCard className="SpHistory-stats-card">
            <MDBCardBody>
              <MDBCardTitle>Order Stats</MDBCardTitle>
              <MDBCardText>
                <strong>Accepted Orders:</strong> {stats.accepted}
              </MDBCardText>
              <MDBCardText>
                <strong>Completed Orders:</strong> {stats.completed}
              </MDBCardText>
              <MDBCardText>
                <strong>Cancelled Orders:</strong> {stats.cancelled}
              </MDBCardText>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        {/* Right Side - Orders and Reviews */}
        <MDBCol md="9" className="SpHistory-right">
          <MDBTabs className="mb-3">
            <MDBTabsItem>
              <MDBTabsLink
                onClick={() => handleTabClick('accepted')}
                active={activeTab === 'accepted'}
              >
                Accepted
              </MDBTabsLink>
            </MDBTabsItem>
            <MDBTabsItem>
              <MDBTabsLink
                onClick={() => handleTabClick('completed')}
                active={activeTab === 'completed'}
              >
                Completed
              </MDBTabsLink>
            </MDBTabsItem>
            <MDBTabsItem>
              <MDBTabsLink
                onClick={() => handleTabClick('cancelled')}
                active={activeTab === 'cancelled'}
              >
                Cancelled
              </MDBTabsLink>
            </MDBTabsItem>
            <MDBTabsItem>
              <MDBTabsLink
                onClick={() => handleTabClick('reviews')}
                active={activeTab === 'reviews'}
              >
                My Reviews
              </MDBTabsLink>
            </MDBTabsItem>
          </MDBTabs>

          <MDBTabsContent>
            {/* Accepted Orders */}
            <MDBTabsPane open={activeTab === 'accepted'}>
              {services.accepted.length > 0 ? (
                <OrderTable
                  orders={services.accepted}
                  status="accepted"
                  getStatusColor={getStatusColor}
                  capitalizeFirstLetter={capitalizeFirstLetter}
                  onComplete={handleMarkAsCompleted}
                />
              ) : (
                <p className="text-center">No accepted orders.</p>
              )}
            </MDBTabsPane>

            {/* Completed Orders */}
            <MDBTabsPane open={activeTab === 'completed'}>
              {services.completed.length > 0 ? (
                <OrderTable
                  orders={services.completed}
                  status="completed"
                  getStatusColor={getStatusColor}
                  capitalizeFirstLetter={capitalizeFirstLetter}
                />
              ) : (
                <p className="text-center">No completed orders.</p>
              )}
            </MDBTabsPane>

            {/* Cancelled Orders */}
            <MDBTabsPane open={activeTab === 'cancelled'}>
              {services.cancelled.length > 0 ? (
                <OrderTable
                  orders={services.cancelled}
                  status="cancelled"
                  getStatusColor={getStatusColor}
                  capitalizeFirstLetter={capitalizeFirstLetter}
                />
              ) : (
                <p className="text-center">No cancelled orders.</p>
              )}
            </MDBTabsPane>

            {/* My Reviews */}
            <MDBTabsPane open={activeTab === 'reviews'}>
              <ReviewsTable reviews={reviews} />
            </MDBTabsPane>
          </MDBTabsContent>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

// OrderTable Component
const OrderTable = ({
  orders,
  status,
  getStatusColor,
  capitalizeFirstLetter,
  onComplete,
}) => {
  const [showMore, setShowMore] = useState({});

  const toggleShowMore = (index) => {
    setShowMore((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  return (
    <MDBTable responsive className="SpHistory-table">
      <MDBTableHead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Client</th>
          <th scope="col">Service</th>
          <th scope="col">Price</th>
          <th scope="col">Description</th>
          <th scope="col">Address</th>
          <th scope="col">Date</th>
          <th scope="col">Status</th>
          {status === 'accepted' && <th scope="col">Actions</th>}
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {orders.length > 0 ? (
          orders.map((order, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{order.client_name}</td>
              <td>{order.name}</td>
              <td>{order.price}</td>
              <td>
                {showMore[index]
                  ? order.description
                  : `${order.description.substring(0, 30)}`}
                {order.description.length > 30 && (
                  <MDBBtn size="sm" onClick={() => toggleShowMore(index)}>
                    {showMore[index] ? 'Show less' : 'Show more'}
                  </MDBBtn>
                )}
              </td>
              <td>{order.address}</td>
              <td>{new Date(order.request_date).toLocaleDateString()}</td>
              <td>
                <MDBBadge color={getStatusColor(order.status)} pill>
                  {capitalizeFirstLetter(order.status)}
                </MDBBadge>
              </td>
              {status === 'accepted' && (
                <td>
                  <MDBBtn
                    color="success"
                    size="sm"
                    onClick={() => onComplete(order.request_id)}
                  >
                    Mark as Completed
                  </MDBBtn>
                </td>
              )}
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="8" className="text-center">
              No orders found.
            </td>
          </tr>
        )}
      </MDBTableBody>
    </MDBTable>
  );
};

// ReviewsTable Component
const ReviewsTable = ({ reviews }) => {
  return (
    <MDBTable responsive className="SpHistory-table">
      <MDBTableHead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Client</th>
          <th scope="col">Service</th>
          <th scope="col">Rating</th>
       
          <th scope="col">Comment</th>
          <th scope="col">Date</th>
        
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{review.client_name}</td>
             <td>{review.service}</td>
               <td> {review.rating} <MDBIcon fas icon="star" className="text-warning" />
              </td>
          
              <td>{review.comment}</td>
              <td>{new Date(review.created_at).toLocaleDateString()}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5" className="text-center">
              No reviews found.
            </td>
          </tr>
        )}
      </MDBTableBody>
    </MDBTable>
  );
};

export default SpHistory;
