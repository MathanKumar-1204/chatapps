// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

// Setup Express
const app = express();
const server = http.createServer(app);

// Allow Cross-Origin requests from frontend
app.use(cors({
  origin: '*', // Frontend IP address (replace with your IP)
  methods: ['GET', 'POST'],
}));

// Setup Socket.IO with CORS configuration
const io = new Server(server, {
  cors: {
    origin: 'http://192.168.226.144:3000', // Frontend IP address (replace with your IP)
    methods: ['GET', 'POST'],
  },
  allowEIO3: true 
});

// Socket.IO logic
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Join a room
  socket.on('join_room', (roomCode) => {
    socket.join(roomCode);
    console.log(`User with ID: ${socket.id} joined room: ${roomCode}`);
  });

  // Send a message to a room
  socket.on('send_message', (messageData) => {
    console.log('Message sent: ', messageData);
    io.in(messageData.roomCode).emit('receive_message', messageData); // Send to all in room
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected: ', socket.id);
  });
});

// Start server
server.listen(5000, () => {
  console.log('Server running on port 5000');
});
