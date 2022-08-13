const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);
const cors = require('cors');
app.use(cors());

let USERS = [];
let READYUSERS = [];
let CARDS = {};
let ISGAMEEND = false;
let PLAYER2STAND = false;

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET,POST'],
    }
});

io.on('connection', (socket) => {
    console.log(`User connected ${socket.id}`);
    socket.on('addUser', (data) => {
        USERS.push({
            id: socket.id,
            name: data.name,
        });
        console.log("USERS");
        console.log(USERS);
        socket.broadcast.emit('getUsers', USERS);
        socket.emit('getUsers', USERS);
    });

    socket.on('userReady', (data) => {
        READYUSERS.push(data);
        console.log("READYUSERS");
        console.log(READYUSERS);
        socket.broadcast.emit('getReadyUsers', READYUSERS);
        socket.emit('getReadyUsers', READYUSERS);
    });

    socket.on('cards', (data) => {
        CARDS=data;
        socket.broadcast.emit('getCards', CARDS);
        socket.emit('getCards', CARDS);
    });

    socket.on('player2Stand', (data) => {
        PLAYER2STAND=true;
        socket.broadcast.emit('getPlayer2Stand', PLAYER2STAND);
    });

    socket.on('endGame', (data) => {
        ISGAMEEND=true;
        socket.broadcast.emit('isGameEnd', ISGAMEEND);
        socket.emit('isGameEnd', ISGAMEEND);
    });
    

    socket.on('clearUsers', (data) => {
        socket.broadcast.emit('isGameEnd', ISGAMEEND);
        socket.emit('isGameEnd', ISGAMEEND);
        USERS = [];
        READYUSERS = [];
        CARDS = {};
        ISGAMEEND = false;
        PLAYER2STAND = false;
        console.log("USERS");
        console.log(USERS);
        console.log("READYUSERS");
        console.log(READYUSERS);
        console.log("CARDS");
        console.log(CARDS);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});
let port=process.env.PORT || 3001;
server.listen(port, () => {
    console.log('SERVER IS RUNNING');
} );