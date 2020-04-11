"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const socket = require("socket.io");
const app = express();
const server = app.listen(3210, () => {
    const port = server.address();
    if ("port" in port) {
        console.log(`PORT::: ${port.port}`);
    }
});
app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
});
const io = socket(server);
app.post("/sendThread/:groupId", ((req, res) => {
    console.log(`POST:: ${req.params.groupId}`);
    io.sockets.in(req.params.groupId).emit('updateChat', `${req.params.groupId} NEW MESSAGE`);
    res.send('SUCCESS');
}));
io.on('connection', (socket) => {
    console.log('SOCKET CONNECTION');
    // socket.emit('chat', 'NEW CHAT MESSAGE');
    socket.on('group', (groupId) => {
        console.log(`GROUPID: ${groupId}`);
        try {
            socket.join(groupId);
            // socket.emit('joinedGroup', 'SERVER', `You have connected to ${groupId}`);
        }
        catch (e) {
            console.warn(e);
        }
    });
    socket.on('sendThread', (groupId) => {
        console.log('GROUP SENDTHREAD:', groupId);
        // we tell the client to execute 'updatechat' with 2 parameters
        io.sockets.in(groupId).emit('updateChat', `${groupId}: NEW MESSAGE`);
    });
    // when the user disconnects.. perform this
    socket.on('disconnect', (data) => {
        // remove the username from global usernames list
        // echo globally that this client has left
        socket.broadcast.emit('updatechat', 'SERVER', data.uid + ' has disconnected');
        socket.leave(data.groupId);
    });
});
//# sourceMappingURL=app.js.map