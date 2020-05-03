const express = require("express");
const path = require("path");
const socketio = require("socket.io");
const http = require("http");
const {
  generateMessage,
  getLeftOverMessages,
  getMsgsInRoom,
  removeMsgsInRoom,
  generateAdminMessage,
} = require("./utils/messages");
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

let count = 0;

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
    console.log(user);
    socket.join(user.roomName);

    // socket.emit(
    //   "serverToClientMessage",
    //   generateAdminMessage(count++, "Welcome " + user.userName, user.roomName)
    // );
    socket.broadcast
      .to(user.roomName)
      .emit(
        "serverToClientMessage",
        generateAdminMessage(
          count++,
          user.userName + " joined the room",
          user.roomName
        )
      );

    callback(generateAdminMessage(count++,"Welcome "+user.userName,user.roomName));
  });

  socket.on("clientToServerMessage", (msgObject, callback) => {
    msgObject.status = "recOnServer";
    msgObject.id = count++;
    console.log("inside client to server " + msgObject);

    const sender = getUser(socket.id);
    if (sender) {
      io.to(sender.roomName).emit(
        "serverToClientMessage",
        generateMessage(msgObject, sender.roomName)
      );
    }
  });

  socket.on("updateMessages", (lastMsgId, roomName, callback) => {
    const missedMsgs = getLeftOverMessages(roomName, lastMsgId);
    console.log("Missed ");
    console.log(missedMsgs);
    if (missedMsgs.length > 0) callback(missedMsgs);
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    if (user) {
      const usersLeftinRoom = getUsersInRoom(user.roomName);
      
      io.to(user.roomName).emit(
        "serverToClientMessage",
        generateAdminMessage(
          count++,
          user.userName + " left the room",
          user.roomName
        )
      );
      if (usersLeftinRoom.length === 0) {
        removeMsgsInRoom(user.roomName);
      }
      
    }
  });
});

app.get("/", (req, res) => {
  res.send("hii welcome");
});

server.listen(port, () => {
  console.log(`Server is listening on port ${port}!`);
});
