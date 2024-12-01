import React, { useState, useEffect } from "react";
import axios from "axios";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import { useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCardText,
  MDBListGroup,
  MDBListGroupItem,
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBIcon,
} from "mdb-react-ui-kit";
import "./SpProfile.css";

const ViewSpProfile = () => {
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");
  const [selectedServices, setSelectedServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [servicesByCategory, setServicesByCategory] = useState({});
   const[avgRating,setAvgRating]=useState(0);
   const[completedcount,setcompletedcount]=useState(0);
   const location = useLocation();

   const { sp_id } = useParams();
   console.log(sp_id);

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

  useEffect(() => {
    if (reviews.length > 0) {
        // Calculate the average rating after reviews are fetched
        const avgRating = calculateAverageRating(reviews);
        setAvgRating(avgRating);
        setcompletedcount(reviews.length);
    }
}, [reviews])
  useEffect(()=>{
    const fetchReviews = async () => {
        try {
      
          const response = await axios.get(`http://localhost:3000/client/viewSPreviews?sp_id=${sp_id}`);
         
    
         
        setReviews(response.data)
 
       
          
       
    
        } catch (error) {
          console.error('Error fetching Reviews:', error);
        }
      };

 
            fetchReviews();
    
  },[sp_id])
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/client/viewSPprofile?sp_id=${sp_id}`);
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [sp_id]);

  useEffect(() => {
    const fetchServicesAndCategories = async () => {
      try {
        // Fetch selected services
        const servicesResponse = await axios.get(`http://localhost:3000/client/viewSPservices?sp_id=${sp_id}`);
        const selectedServiceIds = servicesResponse.data.services.map((service) => service.service_id);
        setSelectedServices(selectedServiceIds);

        // Fetch categories and their services
        const categoriesResponse = await axios.get("http://localhost:3000/categories");
        const fetchedCategories = categoriesResponse.data;

        const filteredCategories = [];
        const servicesData = {};

        for (const category of fetchedCategories) {
          const categoryServicesResponse = await axios.get(
            `http://localhost:3000/services/${category.category_id}`
          );
          const categoryServices = categoryServicesResponse.data.filter((service) =>
            selectedServiceIds.includes(service.service_id)
          );

          if (categoryServices.length > 0) {
            filteredCategories.push(category);
            servicesData[category.category_id] = categoryServices;
          }
        }

        setCategories(filteredCategories);
        setServicesByCategory(servicesData);
      } catch (error) {
        console.error("Error fetching services and categories:", error);
      }
    };
      fetchServicesAndCategories();
  }, [sp_id]);

  if (!profile) return <div>Loading...</div>;

  return (
    <MDBContainer className="py-5">
      <MDBTabs className="mb-3">
        <MDBTabsItem>
          <MDBTabsLink onClick={() => setActiveTab("profile")} active={activeTab === "profile"}>
            <MDBIcon fas icon="user" className="me-2" /> Profile
          </MDBTabsLink>
        </MDBTabsItem>
        <MDBTabsItem>
          <MDBTabsLink
            onClick={() => setActiveTab("services")}
            active={activeTab === "services"}
          >
            <MDBIcon fas icon="briefcase" className="me-2" /> Services Offered
          </MDBTabsLink>
        </MDBTabsItem>
        <MDBTabsItem>
          <MDBTabsLink
            onClick={() => setActiveTab("reviews")}
            active={activeTab === "reviews"}
          >
            <MDBIcon fas icon="briefcase" className="me-2" /> Reviews
          </MDBTabsLink>
        </MDBTabsItem>
      </MDBTabs>

      <MDBTabsContent>
        {/* Profile Tab */}
        <MDBTabsPane open={activeTab === "profile"}>
          <MDBRow>
            <MDBCol lg="4">
              <MDBCard className="mb-4 profile-container">
                <MDBCardBody className="text-center">
                  <MDBCardImage
                    src={`http://localhost:3000/profile/${profile.email}.jpg`}
                    alt="Profile Image"
                    className="rounded-circle profile-picture"
                    style={{ width: "150px" }}
                    fluid
                  />
                  <h4 className="mt-3">
                    {profile.firstName} {profile.lastName}
                  </h4>
                  <strong>Average Rating:</strong>{' '}
               
                    {avgRating}
                    <MDBIcon fas icon="star" className="text-warning" />
                   <br></br>
                    <strong>Completed Orders:  </strong>{'   '}

               
               {completedcount}
               <MDBIcon fas icon="hard-hat" />
                </MDBCardBody>
              </MDBCard>
            </MDBCol>

            <MDBCol lg="8">
              <MDBCard className="mb-4 profile-details-card">
                <MDBCardBody>
                  <MDBListGroup flush className="profile-details-list">
                    <MDBListGroupItem className="d-flex align-items-center profile-item">
                      <div className="profile-label">
                        <strong>Name:</strong>
                      </div>
                      <div className="profile-value">
                        <MDBCardText className="text-muted profile-text">
                          {profile.firstName} {profile.lastName}
                        </MDBCardText>
                      </div>
                    </MDBListGroupItem>
                    <MDBListGroupItem className="d-flex align-items-center profile-item">
                      <div className="profile-label">
                        <strong>City:</strong>
                      </div>
                      <div className="profile-value">
                        <MDBCardText className="text-muted profile-text">{profile.city_name}</MDBCardText>
                      </div>
                    </MDBListGroupItem>
                    <MDBListGroupItem className="d-flex align-items-center profile-item">
                      <div className="profile-label">
                        <strong>Gender:</strong>
                      </div>
                      <div className="profile-value">
                        <MDBCardText className="text-muted profile-text">{profile.gender}</MDBCardText>
                      </div>
                    </MDBListGroupItem>
                    <MDBListGroupItem className="d-flex align-items-center profile-item">
                      <div className="profile-label">
                        <strong>Date of Birth:</strong>
                      </div>
                      <div className="profile-value">
                        <MDBCardText className="text-muted profile-text">{profile.dob}</MDBCardText>
                      </div>
                    </MDBListGroupItem>
                  </MDBListGroup>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBTabsPane>

        {/* Services Tab */}
        <MDBTabsPane open={activeTab === "services"}>
          <div className="preferences-body">
            <div className="preferences-container">
              <h1 className="profile-header">{profile.firstName}'s Services</h1>
              <hr />
              <div className="row">
                {categories.map((category) => (
                  <div key={category.category_id} className="col-md-4 mb-3">
                    <div className="list-group">
                      <h3 className="list-group-item list-group-item-action active">
                        {category.name}
                      </h3>
                      {servicesByCategory[category.category_id].map((service) => (
                        <label key={service.service_id} className="list-group-item d-flex gap-1">
                          <span>{service.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </MDBTabsPane>
        <MDBTabsPane open={activeTab === 'reviews'}>
              <ReviewsTable reviews={reviews} />
            </MDBTabsPane>
      </MDBTabsContent>
    </MDBContainer>
  );
};
const ReviewsTable = ({ reviews }) => {
    return (
      <MDBTable responsive className="SpReviewsTable-table">
        <MDBTableHead>
          <tr>
            <th scope="col">#</th>

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
            
                <td>{review.name}</td>
                <td>
                  {review.rating}{' '}
                  <MDBIcon fas icon="star" className="text-warning" />
                </td>
                <td className="SpReviewsTable-comment">
                  {review.review.length > 50
                    ? `${review.review.substring(0, 50)}...`
                    : review.review}
                </td>
                <td>{new Date(review.review_date).toLocaleDateString()}</td>
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
export default ViewSpProfile;
