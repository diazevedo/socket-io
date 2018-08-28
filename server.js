var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var mongoose = require('mongoose')

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

mongoose.Promise = Promise

var dbUrl = 'mongodb://diazevedo:dap196421@ds133262.mlab.com:33262/mongo-db-node'

var Message = mongoose.model('Message', {
    name: String,
    message: String
})

var messages = [];

app.get('/messages',  (requisition, response) => {
    
    Message.find({}, (err, messages) => {
        response.send(messages);
    })
})

app.get('/messages/:user',  (requisition, response) => {
    var user = requisition.params.user
    Message.find({name: user}, (err, messages) => {
        response.send(messages);
    })
})



app.post('/messages', async (requisition, response) => {
   
    try {
        
        var message = new Message(requisition.body)
        
        var savedMessage  = await message.save()

        var censored = await Message.findOne({message: 'badword'})
        
        if(censored)
            await Message.deleteOne({_id: censored.id})
        else        
            io.emit('message', requisition.body)
        
        response.sendStatus(200)
    } catch(err) {

        response.sendStatus(500)
        return console.error(err)

    } finally {

        console.log('message post called')

    }
})

io.on('connection', (socket) => {
    console.log('user connected');

})

mongoose.connect(dbUrl, { useNewUrlParser: true })


var server = http.listen(3000, () => {
    console.log(`listen on `, server.address().port)
})