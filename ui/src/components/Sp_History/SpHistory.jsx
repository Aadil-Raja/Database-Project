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
import './SpHistory.css'

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
    <MDBContainer fluid className="sp-history-container">
      <MDBRow>
        {/* Left Side - SP Info */}
        <MDBCol md="3" className="sp-history-left">
          <MDBCard className="sp-history-info-card mb-4">
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
          <MDBCard className="sp-history-earnings-card mb-4">
            <MDBCardBody>
              <MDBCardTitle>Earnings</MDBCardTitle>
              <div className="sp-history-period-buttons mb-3">
                <MDBBtn
                  color={selectedPeriod === 'lastWeek' ? 'white' : 'light'}
                  className="me-2 sp-history-period-btn"
                  onClick={() => handlePeriodChange('lastWeek')}
                >
                  Last 7 days
                </MDBBtn>
                <MDBBtn
                  color={selectedPeriod === 'lastMonth' ? 'white' : 'light'}
                  className="me-2 sp-history-period-btn"
                  onClick={() => handlePeriodChange('lastMonth')}
                >
                  Last 30 days
                </MDBBtn>
                <MDBBtn
                  color={selectedPeriod === 'lastSixMonths' ? 'white' : 'light'}
                  className="sp-history-period-btn"
                  onClick={() => handlePeriodChange('lastSixMonths')}
                >
                  Last 6 Months
                </MDBBtn>
              </div>
              <MDBCardText>
                <strong>Total Earnings ({capitalizeFirstLetter(selectedPeriod)}):</strong> 
                 Rs {totalEarnings}
              </MDBCardText>
              <MDBCardText>
                <strong>Overall Earnings:</strong> Rs {overallTotalEarnings}
              </MDBCardText>
            </MDBCardBody>
          </MDBCard>

          {/* Real-time Stats */}
          <MDBCard className="sp-history-stats-card">
            <MDBCardBody>
              <MDBCardTitle>Order Stats</MDBCardTitle>
              <MDBCardText>
                <strong>Accepted Orders:</strong> {stats.accepted}
              </MDBCardText>
              <MDBCardText>
                <strong>Completed Orders:</strong> {stats.completed}
              </MDBCardText>
              {/* <MDBCardText>
                <strong>Cancelled Orders:</strong> {stats.cancelled}
              </MDBCardText> */}
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        {/* Right Side - Orders and Reviews */}
        <MDBCol md="9" className="sp-history-right">
          <MDBTabs className="mb-3 sp-history-tabs">
            <MDBTabsItem>
              <MDBTabsLink
                onClick={() => handleTabClick('accepted')}
                active={activeTab === 'accepted'}
                className="sp-history-tab-link"
              >
                Accepted
              </MDBTabsLink>
            </MDBTabsItem>
            <MDBTabsItem>
              <MDBTabsLink
                onClick={() => handleTabClick('completed')}
                active={activeTab === 'completed'}
                className="sp-history-tab-link"
              >
                Completed
              </MDBTabsLink>
            </MDBTabsItem>
            {/* <MDBTabsItem>
              <MDBTabsLink
                onClick={() => handleTabClick('cancelled')}
                active={activeTab === 'cancelled'}
                className="sp-history-tab-link"
              >
                Cancelled
              </MDBTabsLink>
            </MDBTabsItem> */}
            <MDBTabsItem>
              <MDBTabsLink
                onClick={() => handleTabClick('reviews')}
                active={activeTab === 'reviews'}
                className="sp-history-tab-link"
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
    <MDBTable responsive className="sp-history-table">
      <MDBTableHead className="sp-history-table-head">
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
      <MDBTableBody className="sp-history-table-body">
        {orders.length > 0 ? (
          orders.map((order, index) => (
            <tr key={index} className="sp-history-table-row">
              <td>{index + 1}</td>
              <td>{order.client_name}</td>
              <td>{order.name}</td>
              <td>Rs {parseFloat(order.price).toFixed(2)}</td>
              <td>
                {showMore[index]
                  ? order.description
                  : `${order.description.substring(0, 30)}...`}
                {order.description.length > 30 && (
                  <MDBBtn
                    size="sm"
                    color="info"
                    className="sp-history-show-more-btn"
                    onClick={() => toggleShowMore(index)}
                  >
                    {showMore[index] ? 'Show less' : 'Show more'}
                  </MDBBtn>
                )}
              </td>
              <td>{order.address}</td>

              <td>
  {order.status === 'accepted' || order.status === 'cancelled'
    ? new Date(order.request_date).toLocaleDateString()
    : new Date(order.completed_date).toLocaleDateString()}
</td>

              <td>
                <MDBBadge
                  color={getStatusColor(order.status)}
                  pill
                  className="sp-history-status-badge"
                >
                  {capitalizeFirstLetter(order.status)}
                </MDBBadge>
              </td>
              {status === 'accepted' && (
                <td>
                  <MDBBtn
                    color="success"
                    size="sm"
                    className="sp-history-complete-btn"
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
            <td colSpan="9" className="text-center sp-history-no-orders">
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
      <MDBTable responsive className="SpReviewsTable-table">
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
              <tr key={index} className="SpReviewsTable-row">
                <td>{index + 1}</td>
                <td>{review.client_name}</td>
                <td>{review.service}</td>
                <td>
                  {review.rating}{' '}
                  <MDBIcon fas icon="star" className="text-warning" />
                </td>
                <td className="SpReviewsTable-comment">
                  {review.comment.length > 50
                    ? `${review.comment.substring(0, 50)}...`
                    : review.comment}
                </td>
                <td>{new Date(review.created_at).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No reviews found.
              </td>
            </tr>
          )}
        </MDBTableBody>
      </MDBTable>
    );
  };
  


export default SpHistory;
