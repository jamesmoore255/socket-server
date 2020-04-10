"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http = require("http");
const IO = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = IO.listen(server);
io.sockets.on('connection', (socket) => {
    socket.on('group', (groupId) => {
        socket.join(groupId);
        socket.emit('joinedGroup', 'SERVER', 'You have connected to group');
        socket.broadcast.to(groupId).emit('updateChat', 'SERVER', 'JAMES CONNECTED');
    });
    socket.on('sendThread', (data) => {
        // we tell the client to execute 'updatechat' with 2 parameters
        io.sockets.in(data.groupId).emit('newThread', data);
    });
    // when the user disconnects.. perform this
    socket.on('disconnect', (data) => {
        // remove the username from global usernames list
        // echo globally that this client has left
        socket.broadcast.emit('updatechat', 'SERVER', data.uid + ' has disconnected');
        socket.leave(data.groupId);
    });
});
server.listen(process.env.PORT, () => {
    const port = server.address();
    if ("port" in port) {
        console.log(`PORT::: ${port.port}`);
    }
});
//# sourceMappingURL=app.js.map