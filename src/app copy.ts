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

const sessionParser = session({
    saveUninitialized: false,
    secret: '$eCuRiTy',
    resave: false
});

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// app.use(
//   session({
//       secret: 'you secret key',
//       saveUninitialized: true,
//       resave: false
//   })
// );

app.use(sessionParser);

sessionParser
app.use(function setCommonHeaders(req, res, next) {
    res.set("Access-Control-Allow-Private-Network", "true");
    res.set("Permissions-Policy", "interest-cohort=()")
    next();
});

app.use(cors());

//app.use('/api', routes)

app.post('/login', function (req, res) {
  //
  // "Log in" user and set userId to session.
  //
  const id = 111;

  console.log(`Updating session for user ${id}`);
  (req as any).session.userId = id;
  console.log((req as any).session);
  res.send({ result: 'OK', message: 'Session updated' });
});

app.get('/login', function (req, res) {
  //
  // "Log in" user and set userId to session.
  //
  console.log(`Updating session for user ${(req as any).session.userId}`);
  res.send({ result: 'OK', message: 'Session updated' });
});

// routes.use(sessionParser)

//initialize a simple http server
const server = http.createServer(app);

function onSocketError(err) {
    console.error(err);
}

const map = new Map();

server.on('upgrade', function (request, socket, head) {
    socket.on('error', onSocketError);

    console.log('Parsing session from request...');

    sessionParser(request, {}, () => {
      console.log('Parsing 222');
      console.log(request.session);
      if (!request.session.userId) {
        socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
        socket.destroy();
        return;
      }

      console.log(`Parsing ${request.session}`);
      const clientId = 111

      console.log('Session is parsed!');

      socket.removeListener('error', onSocketError);

      wss.handleUpgrade(request, socket, head, function (ws) {
        wss.emit('connection', ws, request, clientId);
      });
    });
  });

//initialize the WebSocket server instance
const wss = new WebSocket.Server({ clientTracking: false, noServer: true });


wss.on('connection', function (ws, request, client) {
    const userId = client;

    //map.set(userId, ws);

    ws.on('error', console.error);

    ws.on('message', function (message) {
      //
      // Here we can now use session parameters.
      //
      console.log(`Received message ${message} from user ${userId}`);
      ws.send(`Received message ${message} from user ${userId}`);
    });

    ws.on('close', function () {
    //   map.delete(userId);
    });
  });

// wss.on('connection', (ws: WebSocket) => {

//     //connection is up, let's add a simple simple event
//     ws.on('message', (message: string) => {

//         //log the received message and send it back to the client
//         console.log('received: %s', message);
//         ws.send(`Hello, you sent -> ${message}`);
//     });

//     //send immediatly a feedback to the incoming connection
//     ws.send('Hi there, I am a WebSocket server');
// });

//start our server
server.listen(port, () => {
    console.log(`Server started on port ${server.address().port} :)`);
});


// app.listen(port, host, () =>
//     console.log(`Server listens http://${host}:${port}`)
// )
