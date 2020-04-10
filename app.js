"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const websocket = require("ws");
const http = require("http");
const app = express();
const server = http.createServer(app);
const wss = new websocket.Server({ server });
wss.on('connection', (ws, headers) => {
    ws.on('message', (message) => {
        console.log('received:', message);
        ws.send(`G'day: ${headers}`);
    });
    ws.send(`Successfully connected to the websocket, ${headers}`);
});
server.listen(process.env.PORT, () => {
    const port = server.address();
    if ("port" in port) {
        console.log(`PORT::: ${port.port}`);
    }
});
//# sourceMappingURL=app.js.map