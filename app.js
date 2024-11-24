const express = require('express');
const app = express();
const http = require('http').Server(app);
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

let currentprice = 500;
let nprice = currentprice;
let userCount = 0;  

// Serve static files (e.g., index.html)
app.get('/', (req, res) => {
    const option = {
        root: path.join(__dirname)
    };
    const filename = 'index.html';
    res.sendFile(filename, option);
});

app.post('/', (req, res) => {
    let price = req.body.nprice;
    if (price) {
        nprice = price;
        currentprice = price;
        console.log("New Price", nprice);
        io.emit('newuser', currentprice, nprice);  // Emit updated price to all users
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
        userCount--;  // Decrement the user count when a user disconnects
        console.log('User disconnected. Total users: ' + userCount);

        if (userCount === 0) {
            currentprice = 500;
        }
    });
});

http.listen(3000, () => {
    console.log('Server listening on port 3000');
});
