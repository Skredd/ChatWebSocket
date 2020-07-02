const express = require('express');
const path = require('path');

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

io.on('connection', (socket) => {
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