import * as express from 'express';
import * as websocket from "ws";
import * as http from "http";

const app = express();

const server = http.createServer(app);

const wss = new websocket.Server({server});

wss.on('connection', (ws: websocket, headers) => {
    ws.on('message', (message: string) => {
        console.log('received:', message);

        ws.send(`G'day: ${headers}`);
    });

    ws.send(`Successfully connected to the websocket, ${headers}`);
});

server.listen(process.env.PORT, () => {
    const port: any = server.address();
    if ("port" in port) {
        console.log(`PORT::: ${port.port}`);
    }
});
