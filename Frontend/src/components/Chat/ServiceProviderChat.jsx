import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useLocation } from 'react-router-dom';
import './Chat.css'; // Import a CSS file for additional styling
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
  const location = useLocation();
  const [chatOpen, setChatOpen] = useState(false);

  // Extract query parameters and set room, client, and service provider IDs
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const roomName = queryParams.get('room');
    const client_id = queryParams.get('client_id');
    const sp_id = queryParams.get('sp_id');
    
    setRoom(roomName);
    setClientId(client_id);
    setSpId(sp_id);

    // Join the room
    socket.emit('join_room', roomName);

    fetchPreviousMessages(roomName);
  }, [location.search]);
 

  const fetchPreviousMessages = async (roomName) => {
    try {
      const response = await axios.get(`http://localhost:3000/getMessages?room=${roomName}`);
      setMessages(response.data); // Set the previous messages in the state
    } catch (error) {
      console.error('Error fetching previous messages:', error);
    }
  };
  // Set sender and receiver based on user type from localStorage after clientId and spId are set
  useEffect(() => {
    if (clientId && spId) {  // Ensure clientId and spId are available
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
      }
    }
  }, [clientId, spId]); // Now these values are updated only after clientId and spId are set
 
  const sendMessage = async() => {
    const messageData = {
      sender_id: senderID,
      receiver_id: receiverID,
      message_text: message,
      sender_type: sender, 
      receiver_type: receiver,
      room : room,
      timestamp: Date.now(),  // Add a timestamp when the message is sent
    };

    socket.emit('send_message_sp', { messageData, room });
    setMessages([...messages, messageData]);
    setMessage('');
    try{
         await axios.post('http://localhost:3000/saveMessage',messageData);
    }
    catch(error)
    {
      console.log(error);
    }
  };

  useEffect(() => {
    socket.on('receive_message_sp', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });
  }, []);

  // Sort messages by timestamp before rendering
  const sortedMessages = [...messages].sort((a, b) => a.timestamp - b.timestamp);

  return (
    <div>
      {/* Chat Head Container */}
      <div className="chat-head-container">
        <div className="chat-head" onClick={() => setChatOpen(!chatOpen)}>
          {receiver === 'clients' ? 'Client' : 'Service Provider'}
        </div>
      </div>

      {/* Chat Box (conditionally rendered) */}
      {chatOpen && (
        <div className="chat-box">
          <div className="chat-box-header">
            <h4>{receiver === 'clients' ? 'Chat with Client' : 'Chat with Service Provider'}</h4>
            <button onClick={() => setChatOpen(false)}>Close</button>
          </div>
          <div className="chat-box-body messages-container">
            {sortedMessages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.sender_type === sender ? 'sent' : 'received'}`}
              >
                {msg.message_text}
              </div>
            ))}
          </div>
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
