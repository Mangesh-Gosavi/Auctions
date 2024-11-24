const express = require('express');
const app = express();
const http = require('http').Server(app);
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

let currentprice = 4600000;
let nprice = "No current bid";
let userCount = 0;  

// Serve static files (index.html)
app.get('/', (req, res) => {
    const option = {
        root: path.join(__dirname)
    };
    const filename = 'index.html';
    res.sendFile(filename, option);
});

app.post('/', (req, res) => {
    let price = req.body.nprice;
    if (price > currentprice) {
        nprice = price;
        console.log("New Price", nprice);
        io.emit('newuser', currentprice, nprice);  
    }
    else{

    }
});

// Initialize Socket.IO
const io = require('socket.io')(http);

// Socket.IO connection event
io.on('connection', function (socket) {
    userCount++;  
    console.log('User connected. Total users: ' + userCount);

    if (userCount === 1) {
        currentprice = 500;
    }

    socket.emit('newuser', currentprice, nprice);

    socket.on('disconnect', function () {
        userCount--;  
        console.log('User disconnected. Total users: ' + userCount);

        if (userCount === 0) {
            nprice = "No current bid"
        }
    });
});

http.listen(3000, () => {
    console.log('Server listening on port 3000');
});
