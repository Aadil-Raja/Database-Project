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
  MDBBtn
} from 'mdb-react-ui-kit';
import './Requests.css';

const SearchResults = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const requestsResponse = await axios.get('http://localhost:3000/getRequests');
        const requests = requestsResponse.data;

        const cityNamesPromises = requests.map((request) =>
          axios.get(`http://localhost:3000/getCityName?city_id=${request.city_id}`)
        );

        const clientNamesPromises = requests.map((request) =>
          axios.get(`http://localhost:3000/getClientName?client_id=${request.client_id}`)
        );

        const serviceNamesPromises = requests.map((request) =>
          axios.get(`http://localhost:3000/getServiceName?service_id=${request.service_id}`)
        );

        const clientNamesResponses = await Promise.all(clientNamesPromises);
        const cityNamesResponses = await Promise.all(cityNamesPromises);
        const serviceNamesResponses = await Promise.all(serviceNamesPromises);

        const detailedRequests = requests.map((request, index) => ({
          ...request,
          clientName: clientNamesResponses[index].data.name,
          cityName: cityNamesResponses[index].data.name,
          serviceName: serviceNamesResponses[index].data.name,
        }));

        setData(detailedRequests);
      } catch (error) {
        console.error('Error fetching request data:', error);
      } finally {
        setLoading(false);
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

      await axios.post('http://localhost:3000/createORupdateChatHead', chatHeadData);
      navigate('/Spchat', { state: chatHeadData });

    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <p className="loading-text">Loading...</p>;
  }

  return (
    <div className="requests-container">
      <h2 className="requests-header">Client Requests</h2>
      <MDBRow className='row-cols-1 row-cols-md-2 g-4'>
        {data.length > 0 ? (
          data.map((item) => (
            <MDBCol key={item.request_id}>
              <MDBCard className="request-card">
                <MDBCardBody>
                  <MDBCardTitle>Client: {item.clientName}</MDBCardTitle>
                  <MDBCardText>
                    <strong>City:</strong> {item.cityName}
                  </MDBCardText>
                  <MDBCardText>
                    <strong>Service:</strong> {item.serviceName}
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
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          ))
        ) : (
          <p className="no-results">No results found</p>
        )}
      </MDBRow>
    </div>
  );
};

export default SearchResults;
