import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

const socket = io('http://localhost:3002'); // Backend socket URL

const NotificationComponent = () => {
  const [notifications, setNotifications] = useState([]);
  const [clientID, setClientID] = useState(null); // State for storing client_id
  const navigate = useNavigate();

  // Fetch client_id when the component mounts
  useEffect(() => {
    const storedClientID = localStorage.getItem('user_ID'); // Retrieve client_id from localStorage
    if (storedClientID) {
      setClientID(storedClientID); // Set clientID state
    }
  }, []);

  useEffect(() => {
    if (clientID) {
      // Client joins their personal notification room
      socket.emit('join_room', `client_${clientID}`);

      // Listen for notification from server
      socket.on('notification', (data) => {
        setNotifications((prev) => [...prev, data.message]);

        // Automatically navigate to chat when notification is received
        navigate(`/chat?room=${data.room}&client_id=${clientID}&sp_id=${data.sp_id}`);
      });
    }

    // Cleanup socket connection on unmount
    return () => {
      socket.off('notification');
    };
  }, [clientID, navigate]); // Update dependencies to include clientID

  return (
    <div>
      {/* Display notifications */}
      {notifications.map((notification, index) => (
        <div key={index}>{notification}</div>
      ))}
    </div>
  );
};

export default NotificationComponent;
