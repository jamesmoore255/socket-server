"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const websocket = require("ws");
const http = require("http");
const app = express();
const server = http.createServer(app);
const wss = new websocket.Server({ server });
wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        console.log('received:', message);
        ws.send(`G'day: ${message}`);
    });
    ws.send("Successfully connected to the websocket");
});
server.listen(process.env.PORT, () => {
    console.log(`Server started on port: ${server.address()}`);
});
//# sourceMappingURL=app.js.map