require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const { chats } = require("./data/data");

//routes
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");


//express app
const app = express();

// to  parse JSON bodies (req.body)
app.use(express.json());

// middleware for parsing URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

//routes
app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes)
app.use('/api/message', messageRoutes)



//connect to db
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("CONNECTED TO DATABASE SUCCESSFULLY!!!");
    //listen to your port for requests
   const server =  app.listen(process.env.PORT, () => {
        console.log("Listening for requests on port", process.env.PORT);
    });

    const io = require('socket.io')(server, {
          pingTimeout: 60000,
        cors: {
            origin: "http://localhost:3000"
        }
    });

    io.on("connection", (socket) => {
        console.log('connected to socket.io');

        socket.on('setup', (userData) => {
            socket.join(userData._id);
            console.log(userData._id);
            socket.emit("connected");
        });

        socket.on("join chat", (room) => {
            socket.join(room);
            console.log("User Joined Room: " + room);
        });

        socket.on("typing", (room) => socket.in(room).emit("typing"));
        socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

        socket.on("new message", (newMessageReceived) => {
            var chat = newMessageReceived.chat;
            if(!chat.users) return console.log("chat.users not defined");

            chat.users.forEach(user => {
                if(user._id == newMessageReceived.sender._id) return;

                socket.to(user._id).emit("message received", newMessageReceived);

            });
        })
    })
}).catch((err) => {
    console.log("COULD NOT CONNECT TO DATABASE!!!", err.message);
}) 