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
  const [sender, setSender] = useState('serviceproviders');
  const [receiver, setReceiver] = useState('clients');
  const [senderID, setSenderID] = useState(null);
  const [receiverID, setReceiverID] = useState(null);
  const[receiverName,setreceiverName]=useState('');
  const [chatHeads, setChatHeads] = useState([]);
  const location = useLocation();
  const [isInRoom, setIsInRoom] = useState(false);

  useEffect(() => {


   
    const { room, client_id } = location.state || {};
    const sp_id = localStorage.getItem('user_ID');
  const roomName=room;
    setRoom(roomName);
    setClientId(client_id);
    setSpId(sp_id);
    setSenderID(sp_id);
    setReceiverID(client_id);
 
    socket.emit('join_room', roomName);

    console.log(sp_id);
    fetchChatHeads(sp_id);
  }, [location.search]);
  
  const loadChat = async (roomName, client_id) => {
    setIsInRoom(true);
    socket.emit('leave_room', room);
    setRoom(roomName);
    setClientId(client_id);
    setReceiverID(client_id);
    socket.emit('join_room', roomName);
    fetchPreviousMessages(roomName);
   
  };

  const fetchChatHeads = async (sp_id) => {
    try {
      const response = await axios.get(`http://localhost:3000/getChatHeads?user_id=${sp_id}&user_type=serviceproviders`);
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

  const sendMessage = async () => {
    const messageData = {
      sender_id: senderID,
      receiver_id: receiverID,
      message_text: message,
      sender_type: sender, 
      receiver_type: receiver,
      room: room,
      timestamp: Date.now(),
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
        last_message: message,
      };
      
      await axios.post('http://localhost:3000/createORupdateChatHead', chatHeadData);
    } catch(error) {
      console.log(error);
    }
  };

  useEffect(() => {
    socket.on('service_request_canceled', (data) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.request_id === data.request_id ? { ...msg, status: 'canceled' } : msg
        )
      );
    });

    socket.on('receive_service_request', (data) => {
      if (data.room === room && data.sender_type != sender)  {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
     
    });


    socket.on('all_receive_message', (data) => {
      console.log("i am sp receiveing msg");
      console.log(data.room,room,data.sender_type,sender);
      console.log("HELLO",room);
      if (data.room === room && data.sender_type != sender)  {
        console.log("i am sp savingg msg");
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    });

    return () => {
      socket.off('service_request_canceled');
      socket.off('receive_service_request');
      socket.off('all_receive_message');
    };
  }, [room]);

  const handleAcceptRequest = async (requestId) => {
    const requestData = {
      request_id:requestId,
      status: 'accepted',
    };
          
    await axios.put('http://localhost:3000/updateRequestMessage', requestData);

    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.request_id === requestId ? { ...msg, status: 'accepted' } : msg
      )
    );

    

    socket.emit('accept_service_request', { request_id: requestId, room });

    try {
      await axios.post('http://localhost:3000/addAcceptedRequest', { request_id: requestId });
    } catch (error) {
      console.log('Error updating request status:', error);
    }
  };

  const sortedMessages = [...messages].sort((a, b) => a.timestamp - b.timestamp);

  return (
    <MDBContainer fluid className="py-5 chat-head-body">
      <MDBRow>
        <MDBCol md="4">
          <MDBCard id="chat-heads-card" style={{ borderRadius: "15px", backgroundColor: "white" }}>
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
                      className="p-3 border-bottom chat-item"
                      key={chat.client_id}
                      onClick={() => loadChat(chat.room, chat.client_id)}
                      style={{ cursor: "pointer" }}
                    >
                      <div className="d-flex align-items-center">
                        <img
                          src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                          alt="avatar"
                          className="rounded-circle me-3"
                          width="50"
                        />
                        <div className="pt-1">
                          <p className="fw-bold mb-0" style={{ color: "#008080" }}>{chat.client_name}</p>
                          <p className="small text-muted text-truncate">{chat.last_message}</p>
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
            <MDBCard id="chat-box-card" style={{ borderRadius: "15px", backgroundColor: "white" }}>
              <MDBCardBody>
                <div className="chat-box-header d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0" style={{ color: "#008080" }}>Chat with Client</h5>
                </div>
                <div className="chat-scrollbar mb-3" style={{ height: "400px" }}>
                  {sortedMessages.map((msg, index) => (
                    <div
                      key={index}
                      className={`message ${msg.sender_type === sender ? "sent" : "received"}`}
                    >
                      {msg.message_text}
                      {msg.type === "service_request" && msg.status === "pending" && (
                        <button
                          className="btn btn-sm btn-link text-success ms-2"
                          onClick={() => handleAcceptRequest(msg.request_id)}
                        >
                          Accept Request
                        </button>
                      )}
                      {msg.type === "service_request" && msg.status !== "pending" && (
                        <span className="text-muted small">Status: {msg.status}</span>
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
                    className="text-muted"
                    style={{ cursor: "pointer" }}
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

