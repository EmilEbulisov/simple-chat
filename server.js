const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public')); // Убедитесь, что файлы находятся в папке public

io.on('connection', (socket) => {
  console.log('Пользователь подключился');

  socket.on('chat message', ({ nickname, msg }) => {
    io.emit('chat message', { nickname, msg });
  });

  socket.on('disconnect', () => {
    console.log('Пользователь отключился');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Сервер слушает порт ${PORT}`);
});
