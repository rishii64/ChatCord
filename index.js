const express = require("express")
const app = express()
const socket = require("socket.io")
const path = require("path")
const cors = require("cors")
const PORT = process.env.PORT || 5000
const formatMessage = require("./utils/messages")
const {userJoin, getCurrentUser, userLeaves, getRoomUsers} = require("./utils/users")

const server = app.listen(PORT, () => console.log(`server started at port ${PORT}`))
const io = socket(server, {
    cors:{
        origin: "*"
    }
})

// setting public as static folder
app.use(express.static(path.join(__dirname, "public")))

const admin = "Chat bot"

io.on("connection", socket => {
    console.log("New WS connection with socket ID:", socket.id);
    socket.on("joinRoom", ({ username, room }) => {
        const user = userJoin(socket.id, username,room)
        socket.join(user.room)

        //Gretting current user
        socket.emit("message", formatMessage(admin, "Welcome to ChatCord !!"))

        //broadcast when a user connects
        socket.broadcast.to(user.room).emit("message", formatMessage(admin, `${user.username} has joined the chat`))

        //sending users room info
        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomUsers(user.room)
        })

    })

    //listening for chatMessage
    socket.on("chatMessage", msg => {
        const user = getCurrentUser(socket.id)
        io.emit("message", formatMessage(user.username, msg))
    })

    //notify when a user disconnects
    socket.on("disconnect", () => {
        console.log("WS disconnected with ID", socket.id);
        const user = userLeaves(socket.id)
        if(user){
            // io.emit("message", formatMessage(admin, "a user left the chat"));
            socket.broadcast.to(user.room).emit("message", formatMessage(admin, `${user.username} has left the chat`))
        }

        //sending users & room info
        // io.to(user.room).emit("roomUsers", {
        //     room: user.room,
        //     users: getRoomUsers(user.room)
        // })
    })
})
