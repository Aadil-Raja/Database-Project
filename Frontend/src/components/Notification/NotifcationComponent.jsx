import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

const socket = io('http://localhost:3002'); // Backend socket URL

const NotificationComponent = () => {
  const [notifications, setNotifications] = useState([]); // Stores the notifications
  const [userID, setUserID] = useState(null); // State for storing user ID
  const [userType, setUserType] = useState(null); // State to store user type (client or service provider)
  const navigate = useNavigate();

  // Fetch user_id and user_type (client/service provider) when the component mounts
  useEffect(() => {
    const storedUserID = localStorage.getItem('user_ID'); // Retrieve user_ID from localStorage
    const storedUserType = localStorage.getItem('usertype'); // Retrieve usertype from localStorage

    if (storedUserID && storedUserType) {
      setUserID(storedUserID); // Set userID state
      setUserType(storedUserType); // Set userType state
    }
  }, []);

  useEffect(() => {
    if (userID && userType) {
      // Join notification room based on user type (client or service provider)
      if (userType === 'clients') {
        socket.emit('join_room', `client_${userID}`);
      } else if (userType === 'serviceproviders') {
        socket.emit('join_room', `sp_${userID}`);
      }

      // Listen for notification from server
      socket.on('notification', (data) => {
        // Add the notification data to the state, including room and user IDs
        setNotifications((prev) => [
          ...prev, 
          { 
            message: data.message, 
            room: data.room, 
            sp_id: data.sp_id, 
            client_id: data.client_id 
          }
        ]);
      });
    }

    // Cleanup socket connection on unmount
    return () => {
      socket.off('notification');
    };
  }, [userID, userType]);

  // Handle clicking on a notification to navigate to chat
  const handleNotificationClick = (room, sp_id, client_id) => {
    // Navigate to the chat room with the specific room, sp_id, and client_id
    if (userType === 'clients') {
      navigate(`/chat?room=${room}&client_id=${userID}&sp_id=${sp_id}`);
    } else if (userType === 'serviceproviders') {
      navigate(`/chat?room=${room}&client_id=${client_id}&sp_id=${userID}`);
    }
  };

  return (
    <div>
      <h3>Notifications</h3>
      {/* Display notifications */}
      {notifications.length > 0 ? (
        notifications.map((notification, index) => (
          <div
            key={index}
            onClick={() => handleNotificationClick(notification.room, notification.sp_id, notification.client_id)}
            style={{ cursor: 'pointer', padding: '10px', border: '1px solid gray', marginBottom: '5px' }}
          >
            {notification.message}
          </div>
        ))
      ) : (
        <p>No new notifications</p>
      )}
    </div>
  );
};

export default NotificationComponent;
