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
    socket.emit('renderHistory', messages)

    console.log(`new user ${socket.id}`)

    socket.on('newUser', (user, callback) => {
        if (!(user in users)) {
            socket.user = user
            users[user] = socket.id
            callback(true)
        } else callback(false)
    })

    socket.on('sendMessage', (message) => {
        let objMessage = {
            message,
            author: socket.user
        }
        messages.push(objMessage)
        console.log(objMessage)
        io.emit('renderMessage', objMessage)
    })
})

server.listen(PORT, () => {
    console.log('Server running PORT:', PORT)
})