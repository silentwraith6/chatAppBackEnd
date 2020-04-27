const express = require("express");
const path = require("path");
const socketio = require("socket.io");
const http = require("http");
const { generateMessage } = require("./utils/messages");
const {
  getUser,
  getUsersInRoom,
  addUser,
  removeUser,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 5000;




io.on("connection", (socket) => {
  console.log("New connection");

  socket.on("join", (userObject, callback) => {
    const { error, user } = addUser({
      id: socket.id,
      userName: userObject.userName,
      roomName: userObject.roomName,
    });

    if (error) {
      return callback(error);
    }
    console.log(user)
    socket.join(user.roomName);

    socket.emit(
      "message",
      generateMessage("Welcome " , "admin")
    );
    socket.broadcast
      .to(user.roomName)
      .emit(
        "message",
        generateMessage(user.userName + " joined the room", "admin")
      );

    callback();
  });

  socket.on("message", (msgObject, callback) => {

    const user = getUser(socket.id)
    if(user){
        
        io.to(user.roomName).emit(
            "message",
            generateMessage(msgObject.message, msgObject.senderName)
          );
          callback();
    }

    
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.roomName).emit("message", generateMessage(user.userName + " left the room", "admin"));
    }
  });
});

app.get('/',(req,res)=>{
  res.send("hii welcome")
})

server.listen(port, () => {
  console.log(`Server is listening on port ${port}!`);
});
