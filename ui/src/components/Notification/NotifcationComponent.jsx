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
import './NotificationComponent.css'; // Updated CSS file with animations
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ;
const socket = io(SOCKET_URL);

const NotificationComponent = () => {
  const [notifications, setNotifications] = useState([]); // Stores the notifications
  const [userID, setUserID] = useState(null); // State for storing user ID
  const [userType, setUserType] = useState(null); // State to store user type
  const [unreadCount, setUnreadCount] = useState(0); // Unread notifications count
  const [dropdownOpen, setDropdownOpen] = useState(false); // Dropdown state
  const [newNotification, setNewNotification] = useState(null); // Latest notification
  const [iconAnimated, setIconAnimated] = useState(false); // State for icon animation
  const [showNotificationBanner, setShowNotificationBanner] = useState(false); // State to show/hide notification banner

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
        const notification = {
          message: data.message,
          room: data.room,
          sp_id: data.sp_id,
          client_id: data.client_id,
          timestamp: new Date(), // Add a timestamp
        };

        // Add the notification data to the state
        setNotifications((prev) => [...prev, notification]);

        // Increment unread notifications count
        setUnreadCount((prev) => prev + 1);

        // Set the latest notification for banner display
        setNewNotification(notification);
        setShowNotificationBanner(true);

        // Hide the banner after a few seconds
        setTimeout(() => {
          setShowNotificationBanner(false);
        }, 5000); // Hide after 5 seconds

        // Trigger icon animation
        setIconAnimated(true);
        setTimeout(() => setIconAnimated(false), 1000); // Animation duration
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
    setDropdownOpen(false);
  };

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
    if (!dropdownOpen) {
      // Reset unread notifications count when opening the dropdown
      setUnreadCount(0);
    }
  };

  // Function to format time
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className='notification-section'>
      {/* Notification Banner */}
      {showNotificationBanner && newNotification && (
        <div
          className="notification-banner"
          onClick={() => handleNotificationClick(newNotification)}
        >
          <MDBIcon fas icon="bell" className="me-2" />
          {newNotification.message}
          <MDBIcon
            fas
            icon="times"
            className="close-icon"
            onClick={(e) => {
              e.stopPropagation();
              setShowNotificationBanner(false);
            }}
          />
        </div>
      )}

      {/* Notification Icon with Animation */}
      <MDBDropdown>
        <MDBDropdownToggle
          tag="a"
          className="nav-link"
          onClick={toggleDropdown}
          style={{ cursor: 'pointer', color: 'black', position: 'relative' }}
        >
          <MDBIcon
            fas
            icon="bell"
            size="lg"
            className={`notification-bell ${iconAnimated ? 'bell-shake' : ''} ${
              unreadCount > 0 ? 'has-unread' : ''
            }`}
          />
          {unreadCount > 0 && (
            <MDBBadge
              color="danger"
              notification
              pill
              style={{ position: 'absolute', top: '-5px', right: '-10px' }}
            >
              {unreadCount}
            </MDBBadge>
          )}
        </MDBDropdownToggle>
        <MDBDropdownMenu
          show={dropdownOpen}
          style={{ maxHeight: '400px', overflowY: 'auto', width: '300px' }}
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
                  style={{ whiteSpace: 'normal' }}
                >
                  <div className="d-flex justify-content-between">
                    <span>{notification.message}</span>
                    <small className="text-muted ms-2">
                      {formatTime(notification.timestamp)}
                    </small>
                  </div>
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
