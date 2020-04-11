"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const socket = require("socket.io");
const admin = require("firebase-admin");
const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
});
const db = admin.firestore();
const server = app.listen(3210, () => {
    const port = server.address();
    if ("port" in port) {
        console.log(`PORT::: ${port.port}`);
    }
});
app.get('/test', (req, res) => {
    res.send('<h1>Test Working</h1>');
});
const io = socket(server);
app.post("/postThread/:groupId", (async (req, res) => {
    let status = 200;
    let response = { error: false };
    let groupId;
    try {
        groupId = req.params.groupId;
        const body = req.body;
        if (!(body.uid || body.body || groupId)) {
            status = 400;
            response.error = true;
            response.body = `Malformed request, make sure to include uid: ${body.uid}, body: ${body.body}, and groupId: ${groupId}`;
            res.status(status).send(response);
            return;
        }
        const document = await db.collection(`groups/${groupId}/threads`).add(body);
        response.id = document.id;
        io.in(groupId).emit('thread', { id: document.id, body });
        res.status(status).send(document);
        return;
    }
    catch (error) {
        status = 500;
        response.error = true;
        response.message = `Error uploading thread to ${groupId}`;
        console.warn(`Thread post request error: ${error}`);
        res.status(status).send(response);
        return;
    }
}));
app.post("/postReply/:groupId/:threadId", (async (req, res) => {
    let status = 200;
    let response = { error: false };
    let threadId;
    let groupId;
    try {
        threadId = req.params.threadId;
        groupId = req.params.groupId;
        const body = req.body;
        if (!(body.uid || body.body || threadId || groupId)) {
            status = 400;
            response.error = true;
            response.body = `Malformed request, make sure to include uid: ${body.uid}, body: ${body.body}, threadId: ${threadId} and groupId: ${groupId}`;
            res.status(status).send(response);
            return;
        }
        const document = await db.collection(`groups/${groupId}/threads/${threadId}/replies`).add(req.body);
        response.id = document.id;
        io.in(threadId).emit('reply', { id: document.id, body: req.body });
        res.status(status).send(document);
        return;
    }
    catch (error) {
        console.warn(`Error posting reply to: ${threadId}`);
        status = 500;
        response.error = true;
        response.message = `Error uploading reply to group: ${groupId}, thread: ${threadId}`;
        console.warn(`Reply post request error: ${error}`);
        res.status(status).send(response);
        return;
    }
}));
/**
 * Web socket configuration
 */
io.on('connection', (socket) => {
    // Join a group socket room
    socket.on('joinGroup', (groupId) => {
        console.log(`GROUPID: ${groupId}`);
        socket.join(groupId);
        // socket.emit('joinedGroup', 'SERVER', `You have connected to ${groupId}`);
    });
    // Leave a group socket room
    socket.on('leaveGroup', (groupId) => {
        console.log(`leaveGroup: ${groupId}`);
        socket.leave(groupId);
    });
    // Join a thread socket room
    socket.on('joinThread', (threadId) => {
        console.log(`threadId: ${threadId}`);
        socket.join(threadId);
    });
    // Leave a thread socket
    socket.on('leaveThread', (threadId) => {
        console.log(`leaveGroup: ${threadId}`);
        socket.leave(threadId);
    });
    // when the user disconnects.. perform this
    socket.on('disconnect', (_) => {
        socket.leaveAll();
        socket.disconnect();
    });
});
//# sourceMappingURL=app.js.map