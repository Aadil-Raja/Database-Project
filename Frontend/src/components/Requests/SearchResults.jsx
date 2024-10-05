import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SearchResults.css'; // Import any CSS styles if needed

const SearchResults = () => {
  const [data, setData] = useState([]); // State to store all request details
  const [loading, setLoading] = useState(true); // State to show a loading indicator

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        // Fetch all service requests
        const requestsResponse = await axios.get('http://localhost:3000/getRequests');
        const requests = requestsResponse.data;
         
        const cityNamesPromises = requests.map((request) =>
          axios.get(`http://localhost:3000/getCityName?city_id=${request.city_id}`)
        );
        
        // Fetch client names, city names, and service names in parallel, sending the IDs in the body
        const clientNamesPromises = requests.map((request) =>
          axios.get(`http://localhost:3000/getClientName?client_id=${request.client_id}`)
        );
        
        
        const serviceNamesPromises = requests.map((request) =>
          axios.get(`http://localhost:3000/getServiceName?service_id=${request.service_id}`)
        );
  
        // Resolve all promises
        const clientNamesResponses = await Promise.all(clientNamesPromises);
        const cityNamesResponses = await Promise.all(cityNamesPromises);
        const serviceNamesResponses = await Promise.all(serviceNamesPromises);
  
        // Add client names, city names, and service names to requests
        const detailedRequests = requests.map((request, index) => ({
          ...request,
          clientName: clientNamesResponses[index].data.name,
          cityName: cityNamesResponses[index].data.name,
          serviceName: serviceNamesResponses[index].data.name,
        }));
  
        // Update the state with detailed requests
        setData(detailedRequests);
      } catch (error) {
        console.error('Error fetching request data:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchRequests();
  }, []);
  
  const initiateChat = (clientId) => {
    const serviceProviderId = localStorage.getItem('user_ID'); // Assuming you have the SP ID stored
      const roomName = `room_${clientId}_${serviceProviderId}`;
    // Redirect to the chat page and pass the room name and user IDs as params
    window.location.href = `/chat?room=${roomName}&client_id=${clientId}&sp_id=${serviceProviderId}`;
  };
  
  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="search-results">
      {data.length > 0 ? (
        data.map((item) => (
          <div key={item.request_id} className="result-item">
            <h2 className="result-name">Client: {item.clientName}</h2>
            <p className="result-city">City: {item.cityName}</p>
            <p className="result-service">Service: {item.serviceName}</p>
            <p className="result-description">Description: {item.description}</p>
            <p className="result-address">Address: {item.address}</p>
            <button onClick={() => initiateChat(item.client_id)}>Send Message</button>

           
          </div>
        ))
      ) : (
        <p>No results found</p>
      )}
    </div>
  );
};

export default SearchResults;
