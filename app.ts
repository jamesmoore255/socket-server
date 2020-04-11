import * as express from "express";
import * as socket from "socket.io";

const app = express();

const server = app.listen(3210, () => {
    const port: any = server.address();
    if ("port" in port) {
        console.log(`PORT::: ${port.port}`);
    }
});

app.get('/', (req, res) => {
    res.send('<h1>Hello world</h1>');
});

const io = socket(server);

io.on('connection', (socket) => {
    console.log('SOCKET CONNECTION');
    socket.emit('chat', 'NEW CHAT MESSAGE');
    socket.on('group', (groupId) => {
        socket.join(groupId);
        socket.emit('joinedGroup', 'SERVER', 'You have connected to group');
        socket.broadcast.to(groupId).emit('updateChat', 'SERVER', 'JAMES CONNECTED')
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

