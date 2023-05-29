const express = require('express'),
    app = express(),
    //bodyParser = require('body-parser'),
    session = require('express-session'),
    cors = require('cors')
    //redisStorage = require('connect-redis')(session),
    //redis = require('redis'),
    // client = redis.createClient();

const host = 'localhost';
const port = 7000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

app.use(
    session({
        secret: 'you secret key',
        saveUninitialized: true,
        resave: false
    })
);

app.post('/login', (req, res) => {
    console.log("post");
    //if (!req.session.key) req.session.u = 11;
    if (!req.session)
      console.log("session");
    console.log("fds");
    req.session.userid = 111;
    res.status(200).send({ data: 111 })
});

app.get('/login', (req, res) => {
    console.log(req.session.userid);
    res.status(200).send({ data: 222 })
});

app.listen(port, host, function () {
    console.log(`Server listens http://${host}:${port}`);
});