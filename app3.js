const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
// Create a route for your chat application:
app.get("/chat", (req, res) => {
  res.sendFile(__dirname + "/chat2.html");
});
io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
  socket.on("chat message", ({ username, recipient, message }) => {
    console.log(`message: ${message}`);
    io.to(recipient).emit("chat message", { username, message });
  });
});

http.listen(3000, () => {
  console.log("listening on *:3000");
});
