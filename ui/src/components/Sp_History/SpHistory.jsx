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


 import data from './data.js';

const SpHistory = () => {
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [earningsByPeriod, setEarningsByPeriod] = useState({
    lastWeek: 0,
    lastMonth: 0,
    lastSixMonths: 0,
  });
  const [selectedPeriod, setSelectedPeriod] = useState('lastWeek');
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [overallTotalEarnings, setOverallTotalEarnings] = useState(0);
  const [spInfo, setSpInfo] = useState({
    name: '',
    totalEarnings: 0,
    averageRating: 0,
  });

  useEffect(() => {

    fetchServices();

  }, []);

  useEffect(() => {
    calculateEarnings(services);
    calculateOverallEarnings(services);
  }, [services, selectedPeriod]);

  const fetchSpInfo = async () => {
    try {
      const spId = localStorage.getItem('user_ID'); // Assuming SP ID is stored in localStorage
      // Fetch service provider info (name)
      const response = await axios.get(`http://localhost:3000/sp/info/${spId}`);
      setSpInfo((prevInfo) => ({
        ...prevInfo,
        name: response.data.name,
      }));
    } catch (error) {
      console.error('Error fetching service provider info:', error);
    }
  };

  const fetchServices = async () => {
    // try {
    //   const spId = localStorage.getItem('user_ID');
    //   const response = await axios.get(`http://localhost:3000/sp/services/${spId}`);
    //   setServices(response.data);
    // } catch (error) {
    //   console.error('Error fetching services:', error);
     
       setServices(data);
   // }
  };

  const fetchReviews = async () => {
    try {
      const spId = localStorage.getItem('user_ID');
      const response = await axios.get(`http://localhost:3000/sp/reviews/${spId}`);
      setReviews(response.data);

      // Calculate average rating
      const totalRating = response.data.reduce((acc, review) => acc + review.rating, 0);
      const avgRating = response.data.length ? totalRating / response.data.length : 0;

      setSpInfo((prevInfo) => ({
        ...prevInfo,
        averageRating: avgRating,
      }));
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const calculateEarnings = (data) => {
    const now = new Date();
    const earnings = {
      lastWeek: 0,
      lastMonth: 0,
      lastSixMonths: 0,
    };

    data.forEach((service) => {
      if (service.status === 'completed') {
        const completedDate = new Date(service.completed_date);
        const timeDiff = now - completedDate;
        const oneWeek = 7 * 24 * 60 * 60 * 1000;
        const oneMonth = 30 * 24 * 60 * 60 * 1000;
        const sixMonths = 6 * 30 * 24 * 60 * 60 * 1000;

        if (timeDiff <= oneWeek) earnings.lastWeek += service.price;
        if (timeDiff <= oneMonth) earnings.lastMonth += service.price;
        if (timeDiff <= sixMonths) earnings.lastSixMonths += service.price;
      }
    });

    setEarningsByPeriod(earnings);
    setTotalEarnings(earnings[selectedPeriod]);
  };

  const calculateOverallEarnings = (data) => {
    const total = data.reduce((acc, service) => {
      if (service.status === 'completed') {
        return acc + service.price;
      }
      return acc;
    }, 0);

    setOverallTotalEarnings(total);

    // Update total earnings in spInfo
    setSpInfo((prevInfo) => ({
      ...prevInfo,
      totalEarnings: total,
    }));
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

  return (
    <MDBContainer fluid className="SpHistory-container">
      <MDBRow>
        {/* Left Side - SP Info */}
        <MDBCol md="3" className="SpHistory-left">
          <MDBCard className="SpHistory-info-card mb-4">
            <MDBCardBody>
              <MDBCardTitle className="SpHistory-sp-name">{spInfo.name}</MDBCardTitle>
              <MDBCardText>
                <strong>Total Earnings:</strong> ${overallTotalEarnings.toFixed(2)}
              </MDBCardText>
              <MDBCardText>
                <strong>Average Rating:</strong> {spInfo.averageRating.toFixed(1)}{' '}
                <MDBIcon fas icon="star" className="text-warning" />
              </MDBCardText>
            </MDBCardBody>
          </MDBCard>

          {/* Earnings by Period */}
          <MDBCard className="SpHistory-earnings-card">
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
                {totalEarnings.toFixed(2)}
              </MDBCardText>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        {/* Right Side - Orders and Reviews */}
        <MDBCol md="9" className="SpHistory-right">
          <MDBTabs className="mb-3">
            <MDBTabsItem>
              <MDBTabsLink
                onClick={() => handleTabClick('pending')}
                active={activeTab === 'pending'}
              >
                Pending
              </MDBTabsLink>
            </MDBTabsItem>
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
            {/* Pending Orders */}
            <MDBTabsPane open={activeTab === 'pending'}>
              <OrderTable
                orders={services.filter((service) => service.status === 'pending')}
                status="pending"
                getStatusColor={getStatusColor}
                capitalizeFirstLetter={capitalizeFirstLetter}
              />
            </MDBTabsPane>

            {/* Accepted Orders */}
            <MDBTabsPane open={activeTab === 'accepted'}>
              <OrderTable
                orders={services.filter((service) => service.status === 'accepted')}
                status="accepted"
                getStatusColor={getStatusColor}
                capitalizeFirstLetter={capitalizeFirstLetter}
              />
            </MDBTabsPane>

            {/* Completed Orders */}
            <MDBTabsPane open={activeTab === 'completed'}>
              <OrderTable
                orders={services.filter((service) => service.status === 'completed')}
                status="completed"
                getStatusColor={getStatusColor}
                capitalizeFirstLetter={capitalizeFirstLetter}
              />
            </MDBTabsPane>

            {/* Cancelled Orders */}
            <MDBTabsPane open={activeTab === 'cancelled'}>
              <OrderTable
                orders={services.filter((service) => service.status === 'cancelled')}
                status="cancelled"
                getStatusColor={getStatusColor}
                capitalizeFirstLetter={capitalizeFirstLetter}
              />
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
const OrderTable = ({ orders, status, getStatusColor, capitalizeFirstLetter }) => {
  return (
    <MDBTable responsive className="SpHistory-table">
      <MDBTableHead>
        <tr>
          <th scope="col">Order ID</th>
          <th scope="col">Client</th>
          <th scope="col">Service</th>
          <th scope="col">Description</th>
          <th scope="col">Address</th>
          <th scope="col">Date</th>
          <th scope="col">Price</th>
          <th scope="col">Status</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {orders.length > 0 ? (
          orders.map((order, index) => (
            <tr key={index}>
              <td>{order.request_id}</td>
              <td>{order.client_name}</td>
              <td>{order.service_name}</td>
              <td>{order.description}</td>
              <td>{order.address}</td>
              <td>{new Date(order.request_date).toLocaleDateString()}</td>
              <td>${order.price.toFixed(2)}</td>
              <td>
                <MDBBadge color={getStatusColor(order.status)} pill>
                  {capitalizeFirstLetter(order.status)}
                </MDBBadge>
              </td>
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
          <th scope="col">Review ID</th>
          <th scope="col">Client</th>
          <th scope="col">Rating</th>
          <th scope="col">Comment</th>
          <th scope="col">Date</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {reviews.length > 0 ? (
          reviews.map((review, index) => (
            <tr key={index}>
              <td>{review.review_id}</td>
              <td>{review.client_name}</td>
              <td>
                {review.rating} <MDBIcon fas icon="star" className="text-warning" />
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
