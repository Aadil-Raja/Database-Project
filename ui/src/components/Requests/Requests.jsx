import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalBody,
  MDBModalFooter,
  MDBModalTitle
} from 'mdb-react-ui-kit';
import './Requests.css';

const SearchResults = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [imageAvailable, setImageAvailable] = useState({});
  const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const sp_id = localStorage.getItem('user_ID');
        const requestsResponse = await axios.get(`${BASE_URL}/getRequests/${sp_id}`);
        setData(requestsResponse.data);
        setLoading(false);

        // Check for image availability for each request
        const imageAvailability = {};
        for (let item of requestsResponse.data) {
          const imageUrl = `${BASE_URL}/RequestImages/${item.request_id}.jpg`;
          try {
            await axios.head(imageUrl);
            imageAvailability[item.request_id] = true;
          } catch (error) {
            imageAvailability[item.request_id] = false;
          }
        }
        setImageAvailable(imageAvailability);
      } catch (error) {
        console.log("Error in fetching requests");
      }
    };

    fetchRequests();
  }, []);

  const initiateChat = async (clientId) => {
    try {
      const serviceProviderId = localStorage.getItem('user_ID');
      const roomName = `room_${clientId}_${serviceProviderId}`;
      const chatHeadData = {
        room: roomName,
        client_id: clientId,
        sp_id: serviceProviderId,
        last_message: ' ',
      };

      await axios.post(`${BASE_URL}/createORupdateChatHead`, chatHeadData);
      navigate('/Spchat', { state: chatHeadData });

    } catch (error) {
      console.log(error);
    }
  };

  // Function to open the image modal
  const openImageModal = (requestId) => {
    const imageUrl = `${BASE_URL}/RequestImages/${requestId}.jpg`;
    setCurrentImageUrl(imageUrl);
    setShowModal(true);
  };

  // Function to close the image modal
  const closeImageModal = () => {
    setShowModal(false);
  };

  if (loading) {
    return <p className="loading-text">Loading...</p>;
  }

  return (
    <div className="requests-container">
      <h2 className="requests-header">Client Requests</h2>
      <MDBRow className="row-cols-1 row-cols-md-2 g-4">
        {data.length > 0 ? (
          data.map((item, index) => (
            <MDBCol key={index}>
              <MDBCard className="request-card">
                <MDBCardBody>
                  <MDBCardTitle>Client: {item.client_name}</MDBCardTitle>
                  <MDBCardText>
                    <strong>City:</strong> {item.city_name}
                  </MDBCardText>
                  <MDBCardText>
                    <strong>Service:</strong> {item.service_name}
                  </MDBCardText>
                  <MDBCardText>
                    <strong>Description:</strong> {item.description}
                  </MDBCardText>
                  <MDBCardText>
                    <strong>Address:</strong> {item.address}
                  </MDBCardText>
                  <MDBBtn className="message-btn" onClick={() => initiateChat(item.client_id)}>
                    Send Message
                  </MDBBtn>

                  {imageAvailable[item.request_id] === true ? (
                    <MDBBtn
                      className="image-btn"
                      onClick={() => openImageModal(item.request_id)}
                    >
                      View Attachment
                    </MDBBtn>
                  ) : null}
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          ))
        ) : (
          <p className="no-results">No results found</p>
        )}
      </MDBRow>

      {/* Modal to display the image */}
      <MDBModal open={showModal} setShow={setShowModal} tabIndex="-1">
        <MDBModalDialog centered size="xl">
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Image Preview</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={closeImageModal}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody style={{ padding: '0', textAlign: 'center' }}>
              <img
                src={currentImageUrl}
                alt="Full Size"
                style={{
                  width: '100%',
                  maxHeight: '90vh', // Ensure the image doesn't overflow the viewport height
                  objectFit: 'contain', // Prevent distortion
                }}
              />
            </MDBModalBody>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </div>
  );
};

export default SearchResults;
