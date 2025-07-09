// server.js
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

let pcSocket = null;

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('register_pc', () => {
    pcSocket = socket;
    console.log("PC agent registered");
  });

  socket.on('move_mouse', (data) => {
    if (pcSocket) pcSocket.emit('move_mouse', data);
  });

  socket.on('click', (data) => {
    if (pcSocket) pcSocket.emit('click', data);
  });

  socket.on('screenshot_request', () => {
    if (pcSocket) pcSocket.emit('screenshot_request');
  });

  socket.on('screenshot', (data) => {
    io.emit('screenshot', data); // broadcast to web dashboard
  });
});

app.get("/", (req, res) => {
  res.send("Socket.IO backend is running");
});

server.listen(3000, () => {
  console.log("Server listening on port 3000");
});
