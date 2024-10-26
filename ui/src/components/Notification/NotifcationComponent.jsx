import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import {
  MDBIcon,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBBadge,
} from 'mdb-react-ui-kit';
import './NotificationComponent.css'; // Optional for additional styling

const socket = io('http://localhost:3002'); // Backend socket URL

const NotificationComponent = () => {
  const [notifications, setNotifications] = useState([]); // Stores the notifications
  const [userID, setUserID] = useState(null); // State for storing user ID
  const [userType, setUserType] = useState(null); // State to store user type
  const [unreadCount, setUnreadCount] = useState(0); // Unread notifications count
  const [dropdownOpen, setDropdownOpen] = useState(false); // Dropdown state
  const navigate = useNavigate();

  // Fetch user_id and user_type when the component mounts
  useEffect(() => {
    const storedUserID = localStorage.getItem('user_ID');
    const storedUserType = localStorage.getItem('usertype');

    if (storedUserID && storedUserType) {
      setUserID(storedUserID);
      setUserType(storedUserType);
    }
  }, []);

  useEffect(() => {
    if (userID && userType) {
      // Join notification room based on user type
      if (userType === 'clients') {
        socket.emit('join_room', `client_${userID}`);
      } else if (userType === 'serviceproviders') {
        socket.emit('join_room', `sp_${userID}`);
      }

      // Listen for notifications from server
      socket.on('notification', (data) => {
        // Add the notification data to the state
        setNotifications((prev) => [
          ...prev,
          {
            message: data.message,
            room: data.room,
            sp_id: data.sp_id,
            client_id: data.client_id,
          },
        ]);
        // Increment unread notifications count
        setUnreadCount((prev) => prev + 1);
      });
    }

    // Cleanup socket connection on unmount
    return () => {
      socket.off('notification');
    };
  }, [userID, userType]);

  // Handle clicking on a notification to navigate to chat
  const handleNotificationClick = (notification) => {
    const { room, sp_id, client_id } = notification;
    const chatHeadData = {
      room: room,
      client_id: client_id,
      sp_id: sp_id,
    };

    if (userType === 'clients') {
      navigate('/Clientchat', { state: chatHeadData });
    } else if (userType === 'serviceproviders') {
      navigate('/Spchat', { state: chatHeadData });
    }
    // Optionally, mark the notification as read or remove it
  };

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
    if (!dropdownOpen) {
      // Reset unread notifications count when opening the dropdown
      setUnreadCount(0);
    }
  };

  return (
    <div className='notification-section'>
      <MDBDropdown>
        <MDBDropdownToggle
          tag="a"
          className="nav-link"
          onClick={toggleDropdown}
          style={{ cursor: 'pointer', color: 'black' }}
        >
          <MDBIcon fas icon="bell" size="lg" />
          {unreadCount > 0 && (
            <MDBBadge
              color="danger"
              notification
              pill
              style={{ position: 'relative', top: '-10px', left: '-10px' }}
            >
              {unreadCount}
            </MDBBadge>
          )}
        </MDBDropdownToggle>
        <MDBDropdownMenu
          show={dropdownOpen}
          style={{ maxHeight: '400px', overflowY: 'auto' }}
        >
          <h6 className="dropdown-header">Notifications</h6>
          {notifications.length > 0 ? (
            notifications
              .slice()
              .reverse()
              .map((notification, index) => (
                <MDBDropdownItem
                  key={index}
                  onClick={() => handleNotificationClick(notification)}
                  link
                >
                  {notification.message}
                </MDBDropdownItem>
              ))
          ) : (
            <MDBDropdownItem disabled>No new notifications</MDBDropdownItem>
          )}
        </MDBDropdownMenu>
      </MDBDropdown>
    </div>
  );
};

export default NotificationComponent;
