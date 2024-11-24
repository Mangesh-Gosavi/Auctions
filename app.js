const express = require('express');
const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const http = require('http').Server(app);

var path = require('path');
var nprice;
var currentprice = 500

app.use(express.static(path.join(__dirname)));

app.get('/',(req,res)=>{
     var option = {
        root:path.join(__dirname)
     }
     var filename = 'index.html';
     res.sendFile(filename,option);
});

var user = 1;
var io = require('socket.io')(http)

app.post('/',(req,res)=>{
    let price = req.body.nprice
        nprice = price 
        currentprice = price
        console.log("New Price",nprice);
        io.emit('newuser',currentprice,nprice);
        

});

io.on('connection',function(socket){
    console.log('User connected ' + user);
    user++
    socket.emit('newuser',currentprice,nprice);
    
    socket.on('disconnect',function(){
        console.log('User disconnected',user);
        user--
    })
})

http.listen(3000,()=>{
    console.log('Server listening....');
})
