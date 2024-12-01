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
  const [message, setMessage] = useState(''); // Message input state
  const [messages, setMessages] = useState([]); // Messages array
  const [room, setRoom] = useState(''); // Current chat room
  const [clientId, setClientId] = useState(null); // Client ID
  const [spId, setSpId] = useState(null); // Service Provider ID
  const [sender, setSender] = useState('serviceproviders'); // Sender type
  const [receiver, setReceiver] = useState('clients'); // Receiver type
  const [senderID, setSenderID] = useState(null); // Sender ID
  const [receiverID, setReceiverID] = useState(null); // Receiver ID
  const [chatHeads, setChatHeads] = useState([]); // Chat heads
  const [isInRoom, setIsInRoom] = useState(false); // Flag to check if in a room

  const location = useLocation();

  useEffect(() => {
    const { room, client_id } = location.state || {};
    const sp_id = localStorage.getItem('user_ID');
    const roomName = room;
    setRoom(roomName);
    setSpId(sp_id);
    setSenderID(sp_id);

    if (client_id) {
      setClientId(client_id);
      setReceiverID(client_id);
    } else {
      console.warn('client_id is undefined in location.state.');
      // Handle this case appropriately
    }

    socket.emit('join_room', roomName);
    fetchChatHeads(sp_id);
  }, []); // Empty dependency array to prevent re-running

  const fetchChatHeads = async (sp_id) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/getChatHeads?user_id=${sp_id}&user_type=serviceproviders`
      );
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

  const loadChat = async (roomName, client_id) => {
    setIsInRoom(true);
    socket.emit('leave_room', room);
    setRoom(roomName);
    setClientId(client_id);
    setReceiverID(client_id);
    socket.emit('join_room', roomName);
    fetchPreviousMessages(roomName);
  };

  const sendMessage = async () => {
    if (message.trim() === '') return; // Prevent sending empty messages

    if (!receiverID) {
      alert('Please select a chat to send the message.');
      return;
    }

    const messageData = {
      sender_id: senderID,
      receiver_id: receiverID,
      message_text: message.trim(),
      sender_type: sender,
      receiver_type: receiver,
      room: room,
      created_at: Date.now(),
    };

    socket.emit('sp_send_message', { messageData, room });
    setMessages([...messages, messageData]);
    setMessage('');

    try {
      await axios.post('http://localhost:3000/saveMessage', messageData);

      const chatHeadData = {
        room: room,
        client_id: receiverID,
        sp_id: senderID,
        last_message: messageData.message_text,
      };

      await axios.post('http://localhost:3000/createORupdateChatHead', chatHeadData);
      fetchChatHeads(spId); // Update chat heads with the last message
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    socket.on('service_request_canceled', (data) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.request_id === data.request_id && msg.status==='pending' ? { ...msg, status: 'canceled' } : msg
        )
      );
    });

    socket.on('receive_service_request', (data) => {
      if (data.room === room && data.sender_type !== sender) {
        setMessages((prevMessages) => [...prevMessages, data]);
        fetchChatHeads(spId); // Update chat heads when a service request is received
      }
    });

    socket.on('all_receive_message', (data) => {
      if (data.room === room && data.sender_type !== sender) {
        setMessages((prevMessages) => [...prevMessages, data]);
        fetchChatHeads(spId); // Update chat heads when a new message is received
      }
    });

    return () => {
      socket.off('service_request_canceled');
      socket.off('receive_service_request');
      socket.off('all_receive_message');
    };
  }, [room, spId]); // Added spId to dependencies

  const handleAcceptRequest = async (requestId,offeredPrice) => {
    console.log(offeredPrice);
    const priceValue = parseFloat(offeredPrice);
    console.log(priceValue);
    const requestData = {
      request_id: requestId,
      status: 'accepted',
      room: room,

    };

    await axios.put('http://localhost:3000/updateRequestMessage', requestData);

    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.request_id === requestId && msg.status==='pending' ? { ...msg, status: 'accepted' } : msg
      )
    );

    socket.emit('accept_service_request', { request_id: requestId, room });

    try {
      await axios.post('http://localhost:3000/addAcceptedRequest', {

        request_id: requestId,
        sp_id: spId,
        price: priceValue

      });
    } catch (error) {
      console.log('Error updating request status:', error);
    }
  };

  // Sort messages by creation time
  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  );

  return (
    <MDBContainer fluid className="py-5 chat-head-body">
      <MDBRow>
        {/* Chat Heads */}
        <MDBCol md="4">
          <MDBCard
            id="chat-heads-card"
            style={{ borderRadius: '15px', backgroundColor: 'white' }}
          >
            <MDBCardBody>
              
              <div className="chat-scrollbar" style={{ height: '400px' }}>
                <MDBTypography listUnStyled className="mb-0">
                  {chatHeads.map((chat) => (
                    <li
                      className="p-3 border-bottom chat-item"
                      key={chat.client_id}
                      onClick={() => loadChat(chat.room, chat.client_id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="d-flex align-items-center">
                        <img
                           src={`http://localhost:3000/images/chat-head-icon.png`}
                          alt="avatar"
                          className="rounded-circle me-3"
                          width="50"
                        />
                        <div className="pt-1">
                          <p className="fw-bold mb-0" style={{ color: '#008080' }}>
                            {chat.client_name}
                          </p>
                          <p className="small text-muted text-truncate">{chat.lastmsg}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </MDBTypography>
              </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        {/* Chat Box */}
        {isInRoom && (
          <MDBCol md="8">
            <MDBCard
              id="chat-box-card"
              style={{ borderRadius: '15px', backgroundColor: 'white' }}
            >
              <MDBCardBody>
                <div className="chat-box-header d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0" style={{ color: '#008080' }}>
                    Chat with Client
                  </h5>
                </div>
                <div className="chat-scrollbar mb-3" style={{ height: '400px' }}>
                  {sortedMessages.map((msg, index) => (
                    <div
                      key={index}
                      className={`message ${
                        msg.sender_type === sender ? 'sent' : 'received'
                      }`}
                    >
                      <div className="message-content">
                        <p>{msg.message_text}</p>
                        {/* Display time */}
                        <span className="message-time">
                          {new Date(msg.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      {msg.type === 'service_request' && (
                        <div className="service-request-details mt-2">
                          <p>
                            <strong>Offered Price:</strong> {msg.price}
                          </p>
                          {/* Additional details can be fetched if needed */}
                          {msg.status === 'pending' && (
                            <button
                              className="btn btn-sm btn-link text-success mt-2"
                              onClick={() => handleAcceptRequest(msg.request_id,msg.price)}
                            >
                              Accept Request
                            </button>
                          )}
                          {msg.status !== 'pending' && (
                            <span className="text-muted small mt-2">
                              Status: {msg.status}
                            </span>
                          )}
                        </div>
                      )}
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
                    className={`text-muted ${message.trim() === '' ? 'disabled' : ''}`}
                    style={{
                      cursor: message.trim() === '' ? 'not-allowed' : 'pointer',
                    }}
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
