import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useLocation } from 'react-router-dom';
import './Chat.css';
import axios from 'axios';
const socket = io('http://localhost:3002');

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState('');
  const [clientId, setClientId] = useState(null);
  const [spId, setSpId] = useState(null);
  const [sender, setSender] = useState('');
  const [receiver, setReceiver] = useState('');
  const [senderID, setSenderID] = useState(null);
  const [receiverID, setReceiverID] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const roomName = queryParams.get('room');
    const client_id = queryParams.get('client_id');
    const sp_id = queryParams.get('sp_id');
    
    setRoom(roomName);
    setClientId(client_id);
    setSpId(sp_id);

    socket.emit('join_room', roomName);
    fetchPreviousMessages(roomName);
  }, [location.search]);

  const fetchPreviousMessages = async (roomName) => {
    try {
      const response = await axios.get(`http://localhost:3000/getMessages?room=${roomName}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching previous messages:', error);
    }
  };

  useEffect(() => {
    if (clientId && spId) {
      const usertype = localStorage.getItem('usertype');
      if (usertype === "serviceproviders") {
        setSender("serviceproviders");
        setReceiver("clients");
        setSenderID(spId);
        setReceiverID(clientId);
      } else {
        setSender("clients");
        setReceiver("serviceproviders");
        setSenderID(clientId);
        setReceiverID(spId);
        fetchPendingRequests(clientId);
      }
    }
  }, [clientId, spId]);

  const sendMessage = async() => {
    const messageData = {
      sender_id: senderID,
      receiver_id: receiverID,
      message_text: message,
      sender_type: sender, 
      receiver_type: receiver,
      room : room,
      timestamp: Date.now(),
    };

    socket.emit('send_message_sp', { messageData, room });
    setMessages([...messages, messageData]);
    setMessage('');
    try {
      await axios.post('http://localhost:3000/saveMessage', messageData);
    } catch(error) {
      console.log(error);
    }
  };

  const fetchPendingRequests = async (clientId) => {
    try {
      const response = await axios.post('http://localhost:3000/getPendingRequestofClient', { user_ID: clientId });
      setPendingRequests(response.data);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
    }
  };
  useEffect(() => {
    socket.on('receive_service_request', (data) => {
      console.log('Received service request: hello sir', data); // Debugging
      setMessages((prevMessages) => [...prevMessages, data]);
    });
  }, []);
  
  useEffect(() => {
    socket.on('receive_message_sp', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });
    

    // Listener for service request response
    socket.on('service_request_accepted', (data) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.request_id === data.request_id ? { ...msg, status: 'accepted' } : msg
        )
      );
    });
  }, []);

  const sendSelectedRequest = () => {
    if (selectedRequest) {
      const requestData = {
        sender_id: senderID,
        receiver_id: receiverID,
        message_text: `Request for ${selectedRequest.name}`,
        request_id: selectedRequest.request_id,
        room: room,
        timestamp: Date.now(),
        type: 'service_request', // Indicate this is a service request
      };

      socket.emit('service_request', { messageData: requestData, room });
      
     
      setSelectedRequest(null);
    } else {
      console.log("No request selected");
    }
  };

  const handleAcceptRequest = async (requestId) => {
    socket.emit('accept_service_request', { request_id: requestId, room });
    // Update local state to reflect accepted status
    await axios.post(`http://localhost:3000/addAcceptedRequest`,{request_id:requestId});
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.request_id === requestId ? { ...msg, status: 'accepted' } : msg
      )
    );
  };

  const sortedMessages = [...messages].sort((a, b) => a.timestamp - b.timestamp);

  return (
    <div>
      <div className="chat-head-container">
        <div className="chat-head" onClick={() => setChatOpen(!chatOpen)}>
          {receiver === 'clients' ? 'Client' : 'Service Provider'}
        </div>
      </div>

      {chatOpen && (
        <div className="chat-box">
          <div className="chat-box-header">
            <h4>{receiver === 'clients' ? 'Chat with Client' : 'Chat with Service Provider'}</h4>
            <button onClick={() => setChatOpen(false)}>Close</button>
          </div>
          <div className="chat-box-body messages-container">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender_type === sender ? 'sent' : 'received'}`}>
                {msg.message_text}
                {msg.type === 'service_request' && sender === 'serviceproviders' && !msg.status && (
                  <button onClick={() => handleAcceptRequest(msg.request_id)}>Accept Request</button>
                )}
                {msg.type === 'service_request' && sender === 'clients' && (
                  <span>{msg.status ? `Status: ${msg.status}` : 'Pending'}</span>
                )}
              </div>
            ))}
          </div>
          {sender === 'clients' && (
            <div>
              <select onChange={(e) => setSelectedRequest(pendingRequests.find(req => req.request_id === parseInt(e.target.value)))}>
                <option>Select Request</option>
                {pendingRequests.map(req => (
                  <option key={req.request_id} value={req.request_id}>{req.name}</option>
                ))}
              </select>
              <button onClick={sendSelectedRequest}>Send Request</button>
            </div>
          )}
          <div className="chat-box-footer">
            <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type your message..." />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
