import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
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

const socket = io('http://localhost:3002');

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState('');
  const [clientId, setClientId] = useState(null);
  const [spId, setSpId] = useState(null);
  const [senderID, setSenderID] = useState(null);
  const [receiverID, setReceiverID] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [selectedRequestId, setSelectedRequestId] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const[receiverName,setreceiverName]=useState('');
  const [chatHeads, setChatHeads] = useState([]);
  const [chatOpen, setChatOpen] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const { room, sp_id } = location.state || {};
    const client_id = localStorage.getItem('user_ID');;
    const roomName=room;
    setRoom(roomName);
    setClientId(client_id);
    setSpId(sp_id);
    
    setSenderID(client_id);
    setReceiverID(sp_id);
    socket.emit('join_room', roomName);

    fetchPreviousMessages(roomName);
    fetchPendingRequests(client_id);
    fetchChatHeads(client_id);
  }, [location.search]);
 
  
  const fetchChatHeads = async (client_id) => {
    try {
      const response = await axios.get(`http://localhost:3000/getChatHeads?user_id=${client_id}&user_type=clients`);
      setChatHeads(response.data);
    } catch (error) {
      console.error('Error fetching chat heads:', error);
    }
  };

  const fetchPreviousMessages = async (roomName) => {
    try {
      const response = await axios.get(`http://localhost:3000/getMessages?room=${roomName}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching previous messages:', error);
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
  const loadChat = async (roomName, sp_id) => {
    setRoom(roomName);
    setSpId(sp_id);
    setReceiverID(sp_id);
    socket.emit('join_room', roomName);
    fetchPreviousMessages(roomName);
   
  };

  const sendMessage = async() => {
    const messageData = {
      sender_id: senderID,
      receiver_id: receiverID,
      message_text: message,
      sender_type: 'clients', 
      receiver_type: 'serviceproviders',
      room: room,
      timestamp: Date.now(),
    };

    socket.emit('client_send_message', { messageData, room });
    setMessages((prevMessages) => [...prevMessages, messageData]);
    setMessage('');
    try {
      await axios.post('http://localhost:3000/saveMessage', messageData);
      const chatHeadData = {
        room: room,
        client_id: senderID,
        sp_id: receiverID,
        last_message: message,
      };
      
      await axios.post('http://localhost:3000/createORupdateChatHead', chatHeadData);
    } catch(error) {
      console.error('Error saving message:', error);
    }
  };

  const cancelServiceRequest = async (requestId) => {
    const requestData = {
      request_id:requestId,
      status: 'cancelled',
    };
          
    await axios.put('http://localhost:3000/updateRequestMessage', requestData);
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.request_id === requestId ? { ...msg, status: 'cancelled' } : msg
      )
    );
    setSelectedRequestId('');
    setSelectedRequest(null);
    socket.emit('cancel_service_request', { request_id: requestId, room });
  };

  const sendSelectedRequest = async () => {
    if (selectedRequest) {
      const requestData = {
        sender_id: senderID,
        receiver_id: receiverID,
        message_text: `Request for ${selectedRequest.name}`,
        sender_type: 'clients', 
      receiver_type: 'serviceproviders',
        request_id: selectedRequest.request_id,
        room: room,
        timestamp: Date.now(),
        type: 'service_request',
        status: 'pending',
      };
      socket.emit('service_request', { messageData: requestData, room });
      setMessages((prevMessages) => [...prevMessages, requestData]);
      await axios.post('http://localhost:3000/saveRequestMessage', requestData);
      socket.emit('service_request', { messageData: requestData, room });
      setMessages((prevMessages) => [...prevMessages, requestData]);
  
      setSelectedRequestId('');
      setSelectedRequest(null);
    }
  };

  useEffect(() => {
    socket.on('all_receive_message', (data) => {
      if (data.sender_id !== senderID) {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    });

    socket.on('service_request_accepted', (data) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.request_id === data.request_id ? { ...msg, status: 'accepted' } : msg
        )
      );
    });
  }, [senderID]);

  return (
    <MDBContainer fluid className="py-5" style={{ backgroundColor: "#CDC4F9" }}>
      <MDBRow>
      <MDBCol md="4">
          <MDBCard id="chat-heads-card" style={{ borderRadius: "15px" }}>
            <MDBCardBody>
              <MDBInputGroup className="rounded mb-3">
                <input
                  className="form-control rounded"
                  placeholder="Search"
                  type="search"
                />
                <span className="input-group-text border-0" id="search-addon">
                  <MDBIcon fas icon="search" />
                </span>
              </MDBInputGroup>
              <div className="chat-scrollbar" style={{ height: "400px" }}>
                <MDBTypography listUnStyled className="mb-0">
                {chatHeads.map((chat) => (
         <li
         className="p-2 border-bottom"
         key={chat.client_id}
         onClick={() => loadChat(chat.room, chat.sp_id)}
         style={{ cursor: 'pointer' }}
       >
                    
                        <div className="d-flex flex-row">
                          <div>
                            <img
                              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                              alt="avatar"
                              className="d-flex align-self-center me-3"
                              width="60"
                            />
                          </div>
                          <div className="pt-1">
                            <p className="fw-bold mb-0">{chat.sp_name}</p>
                            <p className="small text-muted">{chat.last_message}</p>
                          </div>
                        </div>
                  
                    </li>
                  ))}
                </MDBTypography>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        <MDBCol md="8">
          <MDBCard style={{ borderRadius: "15px" }}>
            <MDBCardBody>
              <div className="chat-box-header d-flex justify-content-between align-items-center">
                <h4>Chat with Service Provider</h4>
                <MDBIcon
                  fas
                  icon="times"
                  onClick={() => setChatOpen(!chatOpen)}
                  className="text-muted"
                  style={{ cursor: "pointer" }}
                />
              </div>
              <div className="chat-scrollbar" style={{ height: "400px" }}>
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`message ${msg.sender_type === 'clients' ? 'sent' : 'received'}`}
                  >
                    {msg.message_text}
                    {msg.type === 'service_request' && (
                      <span>
                        Status: {msg.status ? msg.status.charAt(0).toUpperCase() + msg.status.slice(1) : 'Pending'}
                        {msg.status==='pending' && (
                          <button onClick={() => cancelServiceRequest(msg.request_id)}>Cancel Request</button>
                        )}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <div className="request-selection mt-3">
                <select
                  value={selectedRequestId}
                  onChange={(e) => {
                    const requestId = e.target.value;
                    setSelectedRequestId(requestId);
                    const request = pendingRequests.find((req) => req.request_id === parseInt(requestId));
                    setSelectedRequest(request);
                  }}
                >
                  <option value="">Select Request</option>
                  {pendingRequests.map((req) => (
                    <option key={req.request_id} value={req.request_id}>
                      {req.name}
                    </option>
                  ))}
                </select>
                <MDBIcon
                  fas
                  icon="paper-plane"
                  onClick={sendSelectedRequest}
                  className="text-muted ms-2"
                  style={{ cursor: "pointer" }}
                />
              </div>
              <div className="chat-box-footer d-flex align-items-center mt-3">
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
                  className="text-muted"
                  style={{ cursor: "pointer" }}
                />
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default Chat
