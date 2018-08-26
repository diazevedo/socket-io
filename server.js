var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

var messages = [];

app.get('/messages', (requisition, response) => {
    response.send(messages);
})

app.post('/messages', (requisition, response) => {
    messages.push(requisition.body);
    io.emit('message', requisition.body);
    response.sendStatus(200); 
})

io.on('connection', (socket) => {
    console.log('user connected');

})

var server = http.listen(3000, () => {
    console.log(`listen on `, server.address().port)
})