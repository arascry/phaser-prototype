const express = require('express');
const morgan = require('morgan');
const path = require('path');
const room = require('./room');
const port = '8087';
require('dotenv').config();

const roomsRouter = require('./routes/api/rooms');

const app = express();

app.set('view engine', 'ejs');

app.use('/phaser/game/rooms', roomsRouter);

const server = app.listen(port, () => {
    console.log(`Listening on port:${port}`);
});

const io = require('socket.io').listen(server);

let players = {};

io.sockets.on('connection', (socket) => {
    console.log(`User with ID:${socket.id} connected`);
    socket.on('enter', ({ roomID, x, y }) => {
        socket.join(roomID, (err) => {
            console.log(`Entering ${roomID}`);
            socket.emit('sendPlayers', players);
            players[socket.id] = { x, y };
            socket.to(roomID).emit('enter', { playerID: socket.id, playerInfo: players[socket.id] });
        });
    });

    socket.on('position', ({ roomID, x, y }) => {
        players[socket.id] = {
            x, y
        };
        socket.to(roomID).emit('position', { playerID: socket.id, position: { x, y } });
    });

    socket.on('exit', ({ roomID }) => {
        console.log(`Leaving ${roomID}`);
        console.log('===');
        socket.to(roomID).emit('exit', { playerID: socket.id });
        socket.leave(roomID);
    });

    socket.on('disconnect', () => {
        delete players[socket.id];
    });
});