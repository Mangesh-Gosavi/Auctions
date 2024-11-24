const express = require('express');
const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const http = require('http').Server(app);

var path = require('path');
let currentprice = 4600;
let nprice = 0;
let bid = 0;
var user = 1;

app.use(express.static(path.join(__dirname)));

app.get('/',(req,res)=>{
     var option = {
        root:path.join(__dirname)
     }
     var filename = 'index.html';
     res.sendFile(filename,option);
});

var io = require('socket.io')(http)

app.post('/',(req,res)=>{
    bid = req.body.nprice
    if(bid > currentprice && bid > nprice){
        nprice = bid
        console.log("New Price",nprice);
        io.emit('newuser',currentprice,nprice,bid);
    }
    else{
        console.log("New Price",nprice);
        io.emit('newuser',currentprice,nprice,bid);
    }
});

io.on('connection',function(socket){
    console.log('User connected ' + user);
    user++
    socket.emit('newuser',currentprice,nprice);
    
    socket.on('disconnect',function(){
        console.log('User disconnected',user);
        user--
        if (user === 0) {
            nprice = "No current bid"
        }
    })
})

http.listen(3000,()=>{
    console.log('Server listening....');
})
