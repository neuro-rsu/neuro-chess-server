// const express = require('express'),
//     app = express(),
//     session = require('express-session'),
//     cookieParser = require("cookie-parser"),
//     cors = require('cors')

// const host = '127.0.0.1';
// const port = 7000;

// const oneDay = 1000 * 60 * 60 * 24;

// app.use(express.static(__dirname));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// app.use(cors());

// app.use(
//     session({
//         secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
//         saveUninitialized: true,
//         //store: sessionStore,
//         cookie: {
//             SameSite: 'none',
//             maxAge: 1000 * 60 * 60 * 60
//         },
//         resave: false
//     })
// );

// app.post('/login', (req, res) => {
//     if (!req.session.showAd)
//         req.session.showAd = 0;
//     else
//         req.session.showAd += 1;
//     console.log(`Updating session for user ${(req as any).session.showAd}`);
//     res.status(200).send({ result: 'OK', message: req.session.showAd });
//     //res.sendStatus(200);
// });

// app.get('/login', (req, res) => {
//     if (!req.session.showAd)
//         req.session.showAd = 0;
//     else
//         req.session.showAd += 1;
//     console.log(req.session.showAd);
//     res.status(200).send({ result: 'OK', message: req.session.showAd });
//     //res.sendStatus(200);
// });

// app.get('/logot', (req, res) => {
//     if (!req.session.showAd)
//         req.session.showAd = 0;
//     else
//         req.session.showAd += 1;
//     console.log(req.session.showAd);
//     res.status(200).send({ result: 'OK', message: req.session.showAd });
//     //res.sendStatus(200);
// });

// app.get('/', (req, res) => {
//     res.sendFile('views/index.html',{root:__dirname})
// });

// app.listen(port, host, function () {
//     console.log(`Server listens http://${host}:${port}`);
// });