import type { Express, Router, Request, Response } from 'express'

import * as WebSocket from 'ws';

const express = require('express'),
   app: Express = express(),
   session = require('express-session'),
   routes: Router = require('./routes/index'),
   http = require('http'),
   cors = require('cors')

const host = 'localhost'
const port = 7000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(function setCommonHeaders(req, res, next) {
    res.set("Access-Control-Allow-Private-Network", "true");
    res.set("Permissions-Policy", "interest-cohort=()")
    next();
  });

app.use(cors());

app.use('/api', routes)

//initialize a simple http server
const server = http.createServer(app);

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws: WebSocket) => {

    //connection is up, let's add a simple simple event
    ws.on('message', (message: string) => {

        //log the received message and send it back to the client
        console.log('received: %s', message);
        ws.send(`Hello, you sent -> ${message}`);
    });

    //send immediatly a feedback to the incoming connection
    ws.send('Hi there, I am a WebSocket server');
});

//start our server
server.listen(process.env.PORT || 8999, () => {
    console.log(`Server started on port ${server.address().port} :)`);
});


// app.listen(port, host, () =>
//     console.log(`Server listens http://${host}:${port}`)
// )
