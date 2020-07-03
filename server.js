const express = require('express');
const path = require('path');
const { callbackify } = require('util');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const PORT = process.env.PORT || 3000

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use('/', (req, res) => {
    res.render('index.html')
})

let messages = []
let users = []

io.on('connection', (socket) => {
    socket.on('join', (apelido, callback) => {
        if (!(apelido in users)) {
            socket.apelido = apelido;
            users[apelido] = socket;
            io.sockets.emit("atualizar usuarios", Object.keys(usuarios));
            callbackify(true)
        } else {
            callback(false)
        }
    })

    socket.emit('previousMessages', messages)
    socket.on('sendMessage', (data) => {
        if (messages.length === 50) messages.shift()
        messages.push(data)
        socket.broadcast.emit('receivedMessage', data)
    })
})

server.listen(PORT, () => {
    console.log('Server running PORT:', PORT)
})