const express = require('express');
const morgan = require('morgan');
const path = require('path');
const port = '8087';
require('dotenv').config();

const roomsRouter = require('./routes/api/rooms');

const app = express();

app.set('view engine', 'ejs');
app.use(morgan('dev'));

app.use('/phaser/game/rooms', roomsRouter);

const server = app.listen(port, () => {
    console.log(`Listening on port:${port}`);
});

const io = require('socket.io').listen(server);

io.sockets.on('connection', (socket) => {
    console.log(`User with ID:${socket.id} connected`);
});