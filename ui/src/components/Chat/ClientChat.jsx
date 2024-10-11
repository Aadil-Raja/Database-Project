import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useLocation } from 'react-router-dom';
import './ClientChat.css';
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

const socket = io('http://localhost:3002');

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState('');
  const [clientId, setClientId] = useState(null);
  const [spId, setSpId] = useState(null);
  const [sender, setSender] = useState('clients');
  const [receiver, setReceiver] = useState('serviceproviders');
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
    
    setSenderID(client_id);
    setReceiverID(sp_id);
    socket.emit('join_room', roomName);

    fetchPreviousMessages(roomName);
    fetchPendingRequests(client_id);
  }, [location.search]);

  const fetchPreviousMessages = async (roomName) => {
    try {
      const response = await axios.get(`http://localhost:3000/getMessages?room=${roomName}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching previous messages:', error);
    }
  };

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

    socket.emit('client_send_message', { messageData, room });
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
    socket.on('all_receive_message', (data) => {
      if(data.sender_id !== senderID) {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
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
                  {pendingRequests.map((req, index) => (
                    <li key={index} className="p-2 border-bottom">
                      <a
                        href="#!"
                        className="d-flex justify-content-between"
                        onClick={() => {
                          setSelectedRequest(req);
                          setRoom(req.roomName);
                        }}
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
                            <p className="fw-bold mb-0">{req.name}</p>
                            <p className="small text-muted">
                              {req.lastMessage || 'No messages yet'}
                            </p>
                          </div>
                        </div>
                        <div className="pt-1">
                          <p className="small text-muted mb-1">
                            {req.time}
                          </p>
                        </div>
                      </a>
                    </li>
                  ))}
                </MDBTypography>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        <MDBCol md="8">
          <MDBCard id="chat-box-card" style={{ borderRadius: "15px" }}>
            <MDBCardBody>
              <div className="chat-box-header d-flex justify-content-between align-items-center">
                <h4>Chat</h4>
              </div>
              <div className="chat-scrollbar" style={{ height: "400px" }}>
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`message ${msg.sender_type === sender ? 'sent' : 'received'}`}
                  >
                    {msg.message_text}
                  </div>
                ))}
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

export default Chat;
