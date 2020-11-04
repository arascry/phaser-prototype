require('dotenv').config();
const express = require('express');
const port = '8087';
const fetch = require('node-fetch');
const roomsRouter = require('./routes/api/rooms');
const playersRouter = require('./routes/api/players');

const app = express();

app.set('view engine', 'ejs');
app.use('/phaser/game/rooms', roomsRouter);
app.use('/phaser/game/players', playersRouter);
app.get('/phaser/game/test', (req, res) => {
    console.log(req.socket.address());
});

const server = app.listen({ host: 'localhost', port, exclusive: true }, () => {
    console.log(`Listening on port:${port}`);
});

const io = require('socket.io').listen(server, {
    path: '/phaser/game/socket.io'
});

io.sockets.on('connection', (socket) => {
    console.log(`User with ID:${socket.id} connected`);

    socket.on('listen', ({ roomID }) => {
        socket.join(roomID, (err) => {
            console.log(`${socket.id} now listening on ${roomID}`);
        });
    });

    socket.on('register', ({ roomID, x, y }) => {
        socket.join(roomID, (err) => {
            fetch(`http://localhost:8087/phaser/game/rooms/${roomID}/players`)
                .then(res => res.json())
                .then(players => {
                    socket.emit('sendPlayers', players);
                    socket.to(roomID).emit('enter', { playerID: socket.id, playerInfo: { x, y } });
                });
        });
    });

    socket.on('exit', () => {
        let rooms = Object.keys(socket.rooms);
        socket.to(rooms[1]).emit('exit', { playerID: socket.id });
        socket.leave(rooms[1]);
    });

    socket.on('position', ({ roomID, x, y, frame }) => {
        let rooms = Object.keys(socket.rooms);
        socket.to(rooms[1]).emit('position', { playerID: socket.id, position: { x, y }, frame });
    });

    socket.on('disconnecting', () => {
        let rooms = Object.keys(socket.rooms);
        socket.to(rooms[1]).emit('exit', { playerID: socket.id });
    });
});
