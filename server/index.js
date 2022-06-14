const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const audioRoutes = require('./routes/audio');
const {pathLink} = require('./controllers/audioController')
const app = express();
const socket = require("socket.io");
const socketIoFileUpload = require('socketio-file-upload');
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(express.static('srv/uploads'));

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/audio",audioRoutes);

const server = app.listen(process.env.PORT, () =>
  console.log(`Server started on ${process.env.PORT}`)
);
const io = socket(server, {
  cors: {
    origin: "http://localhost:3001",
    credentials: true,
  },
});


let BLOB;


global.onlineUsers = new Map();
io.on("connection", (socket) => {
  
  const uploader = new socketIoFileUpload();
  uploader.dir = "./srv/uploads";
  uploader.listen(socket);
  global.chatSocket = socket;

  uploader.on("saved",function (event) {
    console.log('reussi');
    const fileSend = event.file;
    const fileName = fileSend.pathName.replace(/^.*[\\\/]/,'');
    const pathLink = `http://localhost:${process.env.PORT}/${fileName}`;
    const blob = {
      pathLink:pathLink,
      isFile:true
    }  
    BLOB=blob;
   
    io.emit("message-file",blob);
  });
  
  uploader.on("error",function (e) {
    console.log("error from uploader",e);
  });

  /* socket.io("send-audio",(data)=>{
    const sendUserSocket = onlineUsers.get(data.to);
    if(sendUserSocket){
      socket.to(sendUserSocket).emit("message-file",BLOB);
    }
  }) */
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket&&BLOB) {
      socket.to(sendUserSocket).emit("message-file",BLOB.pathLink);
      socket.to(sendUserSocket).emit("message-file-recieve",BLOB);
    }else if(sendUserSocket){
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });

});
