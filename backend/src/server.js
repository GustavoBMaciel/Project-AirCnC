const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const socketio = require('socket.io');
const http = require('http');

const routes = require('./routes');

const app = express();
const server = http.Server(app);
const io = socketio(server);

mongoose.connect('mongodb://omnistack:omnistack@omnistack-shard-00-00-pbg2x.mongodb.net:27017,omnistack-shard-00-01-pbg2x.mongodb.net:27017,omnistack-shard-00-02-pbg2x.mongodb.net:27017/semana09?ssl=true&replicaSet=OmniStack-shard-0&authSource=admin&retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const connectedUsers ={};

io.on('connection', socket => {
    const { user_id } = socket.handshake.query;

    connectedUsers[user_id] =  socket.id;
});

app.use((req, res, next) => {
    req.io = io;
    req.connectedUsers = connectedUsers;

    return next();
});

//req.query = Acessar query params (filtros)
//req.params = Acessar route params (edição e delete)
//req.body = Acessar corpo da requisição (criação e edição)

app.use(cors());
app.use(express.json());
app.use('/files', express.static(path.resolve(__dirname, '..', 'uploads')));
app.use(routes);

server.listen(3333);