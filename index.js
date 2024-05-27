const { Server } = require("socket.io");

const io = new Server({ cors: "https://jessechatt.netlify.app/" });
const port = process.env.PORT || 3000

let onlineUser = [];

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  socket.on("addnewuser", (userId) => {
    !onlineUser.some((user) => {
      user.userId === userId;
    }) &&
      onlineUser.push({
        userId,
        socketId: socket.id,
      });

      io.emit("getOnlineUser", onlineUser)
  });

  socket.on("sendMessage", (message)=>{
    const user = onlineUser.find(user => user.userId === message.recipientId)
    if (user){
        io.to(user.socketId).emit("getMessage", message)
        io.to(user.socketId).emit("getNotif", {
            senderId : message.senderId,
            isRead:false,
            date:new Date()
        })
    }
  })

  socket.on("disconnect", ()=>{
    onlineUser = onlineUser.filter(user => user.socketId !== socket.id)
    io.emit("getOnlineUser", onlineUser)
  })
});

io.listen(port);
