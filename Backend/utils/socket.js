// socket/socket.js
const { Server } = require('socket.io');

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // Your client URL
      methods: ["GET", "POST"],
    },
  });

  io.on('connection', (socket) => {
    console.log(`New user connected: ${socket.id}`);

    // Handle when a user joins a specific room
    socket.on('join_room', (room) => {
      socket.join(room); // The user joins the specified room
      console.log(`User with ID: ${socket.id} joined room: ${room}`);
    });

    // Handle incoming messages
    socket.on('send_message_sp', ({ messageData, room }) => {
      console.log('Message received:', messageData);
    
      // Check if the sender is a service provider or client
      if (messageData.sender_type === 'serviceproviders') {
        // Emit the notification to the client
        const clientNotificationRoom = `client_${messageData.receiver_id}`;
        io.to(clientNotificationRoom).emit('notification', {
          message: `New message from SP: ${messageData.message_text}`,
          room: room,
          sp_id: messageData.sender_id,  // Send SP ID so the client can use it
          client_id: messageData.receiver_id // Pass client ID for consistency
        });
      } else if (messageData.sender_type === 'clients') {
        // Emit the notification to the service provider
        const spNotificationRoom = `sp_${messageData.receiver_id}`;
        io.to(spNotificationRoom).emit('notification', {
          message: `New message from Client: ${messageData.message_text}`,
          room: room,
          sp_id: messageData.receiver_id,  // Pass SP ID for consistency
          client_id: messageData.sender_id // Send Client ID so the service provider can use it
        });
      }
    
      // Broadcast the message to all users in the room (including both client and service provider)
      socket.to(room).emit('receive_message_sp', messageData);
    });
    
    // Handle user disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

module.exports = { initSocket };
