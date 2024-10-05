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

      // Ensure that you are sending the notification to the correct client room
      const clientNotificationRoom = `client_${messageData.receiver_id}`;

      // Emit the notification to the specific client
      io.to(clientNotificationRoom).emit('notification', {
        message: `New message from SP: ${messageData.message_text}`,
        room: room,
        sp_id: messageData.sender_id
      });

      // Broadcast the message to all users in the room (including the client)
      socket.to(room).emit('receive_message_sp', messageData);
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

module.exports = { initSocket };
