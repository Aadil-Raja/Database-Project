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
    setSender("serviceproviders");
        setReceiver("clients");
        setSenderID(sp_id);
        setReceiverID(client_id);

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

    socket.emit('sp_send_message', { messageData, room });
    setMessages([...messages, messageData]);
    setMessage('');
    try {
      await axios.post('http://localhost:3000/saveMessage', messageData);
    } catch(error) {
      console.log(error);
    }
  };
  useEffect(() => {
    // Add the event listener with an inline function
    socket.on('service_request_canceled', (data) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.request_id === data.request_id ? { ...msg, status: 'canceled' } : msg
        )
      );
    });
  
    // Cleanup function to remove the event listener
    return () => {
      socket.off('service_request_canceled');
    };
  }, []);
  
  
  useEffect(() => {
    socket.on('receive_service_request', (data) => {
      console.log('Received service request: hello sir', data); // Debugging
      setMessages((prevMessages) => [...prevMessages, data]);
    });
  }, []);
  
  useEffect(() => {
    socket.on('all_receive_message', (data) => {
      if(data.sender_id!=senderID)
        {
            setMessages((prevMessages) => [...prevMessages, data]);
        }
     
    });
  
  }, []);

  const handleAcceptRequest = async (requestId) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.request_id === requestId ? { ...msg, status: 'accepted' } : msg
      )
    );
    socket.emit('accept_service_request', { request_id: requestId, room });
    // Update local state to reflect accepted status
    await axios.post(`http://localhost:3000/addAcceptedRequest`,{request_id:requestId});
    
  };

  const sortedMessages = [...messages].sort((a, b) => a.timestamp - b.timestamp);

  return (
    <div>
      <div className="chat-head-container">
        <div className="chat-head" onClick={() => setChatOpen(!chatOpen)}>
          Chat with Client
        </div>
      </div>
  
      {chatOpen && (
        <div className="chat-box">
          <div className="chat-box-header">
            <h4>Chat with Client</h4>
            <button onClick={() => setChatOpen(false)}>Close</button>
          </div>
          
          <div className="chat-box-body messages-container">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender_type === sender ? 'sent' : 'received'}`}>
                {msg.message_text}
                {/* If this is a service request, show the accept button if not yet accepted */}
                {msg.type === 'service_request' && !msg.status && (
                  <button onClick={() => handleAcceptRequest(msg.request_id)}>Accept Request</button>
                )}
                {/* Display status for accepted requests */}
                {msg.status && (
          <span>Status: {msg.status.charAt(0).toUpperCase() + msg.status.slice(1)}</span>
        )}
              </div>
            ))}
          </div>
  
          {/* Text Input and Send Button */}
          <div className="chat-box-footer">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
  
};

export default Chat;
