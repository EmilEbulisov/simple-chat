const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static('public'));

// Middleware для Express, чтобы добавить текущее время в response locals
app.use((req, res, next) => {
  res.locals.moment = require('moment');
  next();
});

const users = {}; // Объект для отслеживания пользователей

io.on('connection', (socket) => {
  console.log('A user connected');
  
  // При подключении пользователя устанавливаем его статус онлайн
  socket.on('new user', (username) => {
    users[socket.id] = { username, status: 'online' };
    socket.broadcast.emit('user status', { id: socket.id, status: 'online' });
  });

  socket.on('chat message', ({ username, message }) => {
    const time = res.locals.moment().format('HH:mm:ss');
    console.log(`${username}: ${message}`);
    io.emit('chat message', { username, message, time });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
    
    // При отключении пользователя устанавливаем его статус оффлайн
    if (users[socket.id]) {
      const { username } = users[socket.id];
      delete users[socket.id];
      socket.broadcast.emit('user status', { username, status: 'offline' });
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});