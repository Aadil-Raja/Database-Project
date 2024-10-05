import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useLocation } from 'react-router-dom';
import './Chat.css'; // Import a CSS file for additional styling

const socket = io('http://localhost:3002');

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState('');
  const [clientId, setClientId] = useState(null);
  const [spId, setSpId] = useState(null);

  const location = useLocation();

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
  }, [location.search]);

  const sendMessage = () => {
    const messageData = {
      sender_id: spId,
      receiver_id: clientId,
      message_text: message,
      sender_type: 'service_provider',
      receiver_type: 'client',
      timestamp: Date.now(),  // Add a timestamp when the message is sent
    };

    socket.emit('send_message_sp', { messageData, room });
    setMessages([...messages, messageData]);
    setMessage('');
  };

  useEffect(() => {
    socket.on('receive_message_sp', (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });
  }, []);

  // Sort messages by timestamp before rendering
  const sortedMessages = [...messages].sort((a, b) => a.timestamp - b.timestamp);

  return (
    <div className="chat-container">
      <h2>Chat between Client and Service Provider</h2>
      <div className="messages-container">
        {sortedMessages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender_id === spId ? 'sent' : 'received'}`}
          >
            {msg.message_text}
          </div>
        ))}
      </div>
      <div className="message-input-container">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
