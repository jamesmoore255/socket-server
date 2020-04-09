import * as path from 'path';
import * as express from 'express';
import * as createError from 'http-errors';
import * as cookieParser from "cookie-parser";
import * as websocket from "ws";
import * as http from "http";

const app = express();

const server = http.createServer(app);

const wss = new websocket.Server({server});

wss.on('connection', (ws: websocket) => {
    ws.on('message', (message: string) => {
        console.log('received:', message);

        ws.send(`G'day: ${message}`);
    });

    ws.send("Successfully connected to the websocket");
});

server.listen(process.env.PORT, () => {
    console.log(`Server started on port: ${server.address()}`);
});