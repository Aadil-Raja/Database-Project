import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBTypography,
  MDBInputGroup,
} from 'mdb-react-ui-kit';

import './ClientChat.css';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL 
const socket = io(SOCKET_URL);

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState('');
  const [clientId, setClientId] = useState(null);
  const [spId, setSpId] = useState(null);
  const [senderID, setSenderID] = useState(null);
  const [receiverID, setReceiverID] = useState(null);
  const [sender, setSender] = useState('clients');

  const [pendingRequests, setPendingRequests] = useState([]);
  const [selectedRequestId, setSelectedRequestId] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [receiverName, setreceiverName] = useState('');
  const [chatHeads, setChatHeads] = useState([]);
  const [chatOpen, setChatOpen] = useState(true);
  const [isInRoom, setIsInRoom] = useState(false);
  const [offeredPrice, setOfferedPrice] = useState('');

  const location = useLocation();
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BACKEND_URL ;
  useEffect(() => {
    const { room, sp_id } = location.state || {};
    const client_id = localStorage.getItem('user_ID');
    const roomName = room;
    setRoom(roomName);
    setClientId(client_id);
    setSenderID(client_id);

    if (sp_id) {
      setSpId(sp_id);
      setReceiverID(sp_id);

    } else {
      // Do not set receiverID to undefined
      console.warn('sp_id is undefined in location.state.');
      // Optionally, handle this case, e.g., set a default receiverID or prompt the user
    }

    socket.emit('join_room', roomName);
    fetchPendingRequests(client_id);
    fetchChatHeads(client_id);
  }, []);
  const fetchemail = async (sp_id) => {
    try {
      const response = await axios.get(`${BASE_URL}/getEmail?sp_id=${sp_id}`);
      setSpEmail(response.email);

    }
    catch (error) {
      console.error('Error fetching chat heads:', error);
    }
  }
  const fetchChatHeads = async (client_id) => {
    try {
      const response = await axios.get(`${BASE_URL}/getChatHeads?user_id=${client_id}&user_type=clients`);
      setChatHeads(response.data);
    } catch (error) {
      console.error('Error fetching chat heads:', error);
    }
  };

  const fetchPreviousMessages = async (roomName) => {
    try {
      const response = await axios.get(`${BASE_URL}/getMessages?room=${roomName}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching previous messages:', error);
    }
  };

  const fetchPendingRequests = async (clientId) => {
    try {
      const response = await axios.post(`${BASE_URL}/getPendingRequestofClient`, { user_ID: clientId });
      setPendingRequests(response.data);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
    }
  };
  const loadChat = async (roomName, sp_id) => {
    setIsInRoom(true);
    socket.emit('leave_room', room);
    setRoom(roomName);
    setSpId(sp_id);
    setReceiverID(sp_id);
    socket.emit('join_room', roomName);
    console.log('Updated receiverID:', sp_id);
    fetchPreviousMessages(roomName);

  };
  const ViewProfile = async (sp_id) => {
    const Data = {
      sp_id: sp_id,

    };
    navigate(`/ViewProfile/${sp_id}`);
    window.location.reload;
  }
  const sendMessage = async () => {
    if (message.trim() === '') return;
    if (!receiverID) {
      alert('Please select a chat to send the request.');
      return;
    }
    const messageData = {
      sender_id: senderID,
      receiver_id: receiverID,
      message_text: message,
      sender_type: 'clients',
      receiver_type: 'serviceproviders',
      room: room,
      created_at: Date.now(),
    };

    socket.emit('client_send_message', { messageData, room });
    setMessages((prevMessages) => [...prevMessages, messageData]);

    try {
      await axios.post(`${BASE_URL}/saveMessage`, messageData);
      const chatHeadData = {
        room: room,
        client_id: senderID,
        sp_id: receiverID,
        last_message: message,
      };

      await axios.post(`${BASE_URL}/createORupdateChatHead`, chatHeadData);
      fetchChatHeads(clientId);
      setMessage('');
    } catch (error) {
      console.error('Error saving message:', error);
    }
  };

  const cancelServiceRequest = async (requestId) => {
    const requestData = {
      request_id: requestId,
      status: 'cancelled',
      room: room
    };

    await axios.put(`${BASE_URL}/updateRequestMessage`, requestData);
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.request_id === requestId && msg.status === 'pending' ? { ...msg, status: 'cancelled' } : msg
      )
    );
    setSelectedRequestId('');
    setSelectedRequest(null);
    socket.emit('cancel_service_request', { request_id: requestId, room });
  };

  const sendSelectedRequest = async () => {
    if (selectedRequest) {
      if (!receiverID) {
        alert('Please select a chat to send the request.');
        return;
      }
      const priceValue = parseFloat(offeredPrice);

      if (isNaN(priceValue)) {
        alert('Please enter a valid price.');
        return;
      }

      const requestId = parseInt(selectedRequest.request_id);
      if (isNaN(requestId)) {
        console.error('Invalid request ID');
        return;
      }

      const requestData = {
        sender_id: senderID,
        receiver_id: receiverID,
        message_text: `Request for ${selectedRequest.name}`,
        sender_type: 'clients',
        receiver_type: 'serviceproviders',
        request_id: requestId,
        room: room,
        created_at: Date.now(),
        type: 'service_request',
        status: 'pending',
        price: priceValue,
      };

      try {
        console.log('Sending request data:', requestData);

        // Emit the service request via socket
        socket.emit('service_request', { messageData: requestData, room });
        setMessages((prevMessages) => [...prevMessages, requestData]);

        // Save the request message to the database
        await axios.post(`${BASE_URL}/saveRequestMessage`, requestData);

        const chatHeadData = {
          room: room,
          client_id: senderID,
          sp_id: receiverID,
          last_message: `Request for ${selectedRequest.name}`,
        };

        await axios.post(`${BASE_URL}/createORupdateChatHead`, chatHeadData);
        fetchChatHeads(clientId);

        // Reset the form
        setSelectedRequestId('');
        setSelectedRequest(null);
        setOfferedPrice('');
      } catch (error) {
        console.error('Error sending service request:', error);
      }
    }
  };



  useEffect(() => {
    socket.on('all_receive_message', (data) => {
      console.log("i am client receiveing msg");
      console.log(data.room, room, data.sender_type, sender);
      if (data.room === room && data.sender_type != sender) {
        console.log("i am client savingg msg");
        setMessages((prevMessages) => [...prevMessages, data]);
        fetchChatHeads(clientId);
      }
    });

    socket.on('service_request_accepted', (data) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.request_id === data.request_id && msg.status === 'pending' ? { ...msg, status: 'accepted' } : msg
        )
      );
      setPendingRequests((prevRequests) =>
        prevRequests.filter((req) => req.request_id !== data.request_id)
      );
    });
    return () => {
      socket.off('all_receive_message');
      socket.off('service_request_accepted');
    };
  }, [room]);

  return (
    <MDBContainer fluid className="py-5 chat-head-body">
      <MDBRow>
        <MDBCol md="4">
          <MDBCard id="chat-heads-card" className="custom-chat-card">
            <MDBCardBody>
              
              <div className="chat-scrollbar custom-chat-scroll">
                <MDBTypography listUnStyled className="chat-list mb-0">
                  {chatHeads.map((chat) => (
                    <li
                      className="p-3 border-bottom chat-item custom-chat-item"
                      key={chat.client_id}
                      onClick={() => loadChat(chat.room, chat.sp_id)}
                    >
                      <div className="d-flex align-items-center">
                        <img
                          src={`${BASE_URL}/profile/${chat.email}.jpg`}
                          alt="avatar"
                          className="rounded-circle me-3 chat-avatar"
                          onError={(e) => { e.target.onerror = null; e.target.src = `${BASE_URL}/profile/default-avatar.png`; }} 
                        />
                        <div className="pt-1 chat-content">
                          <p className="fw-bold mb-1 chat-name">{chat.sp_name}</p>
                          <p className="small text-muted text-truncate chat-message">{chat.lastmsg}</p>
                          <button
                            className="view-profile-btn"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent parent onClick
                              ViewProfile(chat.sp_id);
                            }}
                          >
                            View Profile
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </MDBTypography>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        {isInRoom && (
          <MDBCol md="8">
            <MDBCard style={{ borderRadius: "15px", backgroundColor: "white" }}>
              <MDBCardBody>
                <div className="chat-box-header d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0" style={{ color: "#008080" }}>Chat with Service Provider</h5>
                  <MDBIcon
                    fas
                    icon="times"
                    onClick={() => setChatOpen(!chatOpen)}
                    className="text-muted"
                    style={{ cursor: "pointer" }}
                  />
                </div>
                <div className="chat-scrollbar mb-3" style={{ height: "400px" }}>
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`message ${msg.sender_type === "clients" ? "sent" : "received"}`}
                    >
                      <div className="message-content">
                        <p>{msg.message_text}</p>

                        <span className="message-time">
                          {new Date(msg.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      {msg.type === "service_request" && (
                        <div className="text-muted small">
                          <p>Status: {msg.status ? msg.status.charAt(0).toUpperCase() + msg.status.slice(1) : "Pending"}</p>
                          <p>Offered Price: {msg.price}</p>
                          {msg.status === "pending" && (
                            <button
                              className="btn btn-sm btn-link text-danger ms-2"
                              onClick={() => cancelServiceRequest(msg.request_id)}
                            >
                              Cancel Request
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="request-selection mb-3">
                  <select
                    className="form-select"
                    value={selectedRequestId}
                    onChange={(e) => {
                      const requestId = e.target.value;
                      setSelectedRequestId(requestId);
                      const request = pendingRequests.find(
                        (req) => req.request_id === parseInt(requestId)
                      );
                      setSelectedRequest(request);
                      setOfferedPrice(''); // Reset the offered price when a new request is selected
                    }}
                  >
                    <option value="">Select Request</option>
                    {pendingRequests.map((req) => (
                      <option key={req.request_id} value={req.request_id}>
                        {req.name}
                      </option>
                    ))}
                  </select>

                  {selectedRequest && (
                    <div className="selected-request-details mt-3">
                      <p>
                        <strong>Description:</strong> {selectedRequest.description}
                      </p>
                      <p>
                        <strong>Address:</strong> {selectedRequest.address}
                      </p>
                      <p>
                        <strong>Request Date:</strong>{' '}
                        {new Date(selectedRequest.request_date).toLocaleDateString()}
                      </p>

                      <div className="price-input mt-2">
                        <label>
                          <strong>Offered Price:</strong>
                        </label>
                        <input
                          type="number"
                          value={offeredPrice}
                          onChange={(e) => setOfferedPrice(e.target.value)}
                          placeholder="Enter your price"
                          className="form-control mt-1"
                        />
                      </div>

                      <button
                        className="btn btn-primary mt-3"
                        onClick={sendSelectedRequest}
                        disabled={!offeredPrice}
                      >
                        Send Request <MDBIcon fas icon="paper-plane" className="ms-1" />
                      </button>
                    </div>
                  )}
                </div>



                <div className="chat-box-footer d-flex align-items-center">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="form-control me-2"
                  />
                  <MDBIcon
                    fas
                    icon="paper-plane"
                    onClick={sendMessage}
                    className={`text-muted ${message.trim() === '' ? 'disabled' : ''}`}
                    style={{ cursor: message.trim() === '' ? 'not-allowed' : 'pointer' }}
                  />
                </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        )}
      </MDBRow>
    </MDBContainer>
  );
};

export default Chat;