import type { Express, Router, Request, Response } from 'express'

import * as ULID from 'ulid';

import 'dotenv/config'

import express from 'express'

import cors from 'cors'

import http from 'http'

import session from 'express-session'

import routes from './routes/index.js'

import { AddressInfo } from 'net'

import * as WebSocket from 'ws';

import { WebSocketServer } from 'ws'

import i18next from 'i18next'

import i18nextMiddleware from 'i18next-express-middleware'

import auth from './auth/auth.service.js'




import bcrypt from 'bcrypt'

import jwt from 'jsonwebtoken'

const app: Express = express()

const clientsMap = new Map();

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


app.use(function setCommonHeaders(req, res, next) {
    res.set("Access-Control-Allow-Private-Network", "true");
    res.set("Permissions-Policy", "interest-cohort=()")
    next();
});

app.use(cors());

app.use('/api', routes)

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
    //  socket.on('error', onSocketError);

    console.log('Parsing session from request...');

    const clientId = ULID.ulid();

    console.log(`Session is parsed!${clientId}`);

    // socket.removeListener('error', onSocketError);

    wss.handleUpgrade(request, socket, head, function (ws) {
      wss.emit('connection', ws, request, clientId);
    });
  });

//initialize the WebSocket server instance
const wss = new WebSocketServer({ clientTracking: false, noServer: true });

const whiteGameQueue = [];
const blackGameQueue = [];
const gameQueue = new Map();

wss.on('connection', function (ws, request, client) {
    let userId = client;

    clientsMap.set(userId, ws);

    console.log(`connetction: ${userId}`);
    //map.set(userId, ws);

    ws.on('error', console.error);

    ws.on('message', function (message) {
      let text = "";
      const msg = JSON.parse(message);
      const time = new Date(msg.date);
      const timeStr = time.toLocaleTimeString();

      switch (msg.type) {
        case "id":
          console.log(`id: ${userId}`);
          break;
        case "username":
          text = `User <em>${msg.name}</em> signed in at ${timeStr}<br>`;
          break;
        case "message":
          text = `(${timeStr}) ${msg.name} : ${msg.text} <br>`;
          break;
        case "step":
          const data = msg.text;
          const step = data.step;
          console.log(`data: ${JSON.stringify(data)}`);
          console.log(`step: ${JSON.stringify(step)}`);

          const answerMsg = {
            type: "enemyStep",
            text: `step`,
            data: step,
            id: 111,
            date: Date.now(),
          };
          const enemyWS = clientsMap.get(data.enemy);
          enemyWS.send(JSON.stringify(answerMsg));
          break;
        case "whitegame":
          console.log(`white: ${userId}`);
          if (blackGameQueue.length !== 0)
          {
            const blackUserUlid = blackGameQueue.pop();
            const gameUlid = ULID.ulid()
            let game = {whiteUser: userId, blackUser: blackUserUlid, game: gameUlid}
            console.log(`WhiteGame: ${game}`);
            gameQueue.set(gameUlid, game);
            const answerMsg = {
              type: "game",
              text: `Игра нашлась`,
              data: game,
              id: 111,
              date: Date.now(),
            };
            const blackWS = clientsMap.get(blackUserUlid);
            blackWS.send(JSON.stringify(answerMsg));
            ws.send(JSON.stringify(answerMsg));
          }
          else {
            console.log(`whiteGameQueue: ${userId}`);
            whiteGameQueue.push(userId)
          }
          break;
        case "blackgame":
          console.log(`blackgame: ${userId}`);
          if (whiteGameQueue.length !== 0)
          {
            const whiteUserUlid = whiteGameQueue.pop();
            const gameUlid = ULID.ulid()
            let game = {whiteUser: whiteUserUlid, blackUser: userId, game: gameUlid}
            console.log(`blackGame: ${game}`);
            gameQueue.set(gameUlid, game);
            const answerMsg = {
              type: "game",
              text: `Игра нашлась`,
              data: game,
              id: 111,
              date: Date.now(),
            };
            const blackWS = clientsMap.get(whiteUserUlid);
            blackWS.send(JSON.stringify(answerMsg));
            ws.send(JSON.stringify(answerMsg));
          }
          else {
            blackGameQueue.push(userId)
          }
          break;
  //       case "SingIn":
  //         const saltRounds = 10
  //         bcrypt
  //         .hash(msg.text.password, saltRounds)
  //         .then(hash => {
  //         userHash = hash
  //   console.log('Hash ', hash)
  //   //validateUser(hash)
  // })
  // .catch(err => console.error(err.message))
        case "login":
            auth.getLogin(msg.text.login).then((res: any) => {
              if (res.rows.length === 0 ) {
                const answerMsg = {
                  type: "authError",
                  text: `Пользователь ${msg.text.login} не найден`,
                  id: 111,
                  date: Date.now(),
                };
                ws.send(JSON.stringify(answerMsg));
              }
              else {
                res.rows.forEach(user => {
                  console.log(user)
                  if (user.doc.password === msg.text.password) {
                    const answerMsg = {
                      type: "authOк",
                      text: `Добро пожаловать ${msg.text.login}`,
                      id: 111,
                      date: Date.now(),
                    };

                    clientsMap.delete(userId);
                    userId = user.doc._id;
                    clientsMap.set(userId, ws);
                    ws.send(JSON.stringify(answerMsg));
                  }
                  else {
                    const answerMsg = {
                      type: "authError",
                      text: `Неправильный пароль для пользователя ${msg.text.login}`,
                      id: 111,
                      date: Date.now(),
                    };
                    ws.send(JSON.stringify(answerMsg));
                  }
                });
              }
            });

            // const data = msg;
            // ws.send(`Received message ${msg.text.login} from user ${msg.text.password}`);
            break;
      }
      // ws.send(`Received message ${msg} from user ${userId}`);
    });

    ws.on('close', function () {
      clientsMap.delete(userId);
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
server.listen(process.env.PORT, () => {
    console.log(`Server started on port ${(server.address() as AddressInfo).port} :)`);
});


// app.listen(port, host, () =>
//     console.log(`Server listens http://${host}:${port}`)
// )
