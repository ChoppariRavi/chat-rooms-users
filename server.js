const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const botName = "Chat Friend Bot";

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

// Run when client connects
io.on("connection", socket => {
  socket.emit("message", formatMessage(botName, "Welcome to Chat Friend!"));

  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    //Broadast when user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `A ${username} has joined the chat`)
      );

    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

  // Runs when user Disconnects
  socket.on("disconnect", () => {
    const user = getCurrentUser(socket.id);    
    io.to(user.room).emit(
      "message",
      formatMessage(user.username, "A user has disconnected!")
    );
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room)
    });
    userLeave(socket.id);
  });

  socket.on("chatMessage", messgae => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, messgae));
  });
});

const PORT = process.env.PORT || 3000;

// app.get('/', (req, res) => res.send('Hello World!'))
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
