const express = require("express");
const app = express();
app.use(express.json()); // Add this line to parse JSON request bodies

const http = require("http").createServer(app);
const io = require("socket.io")(http);
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const secret = "my-secret-key"; // Replace with your own secret key

// Middleware to parse cookies
app.use(cookieParser());
const users = [
  { id: 1, username: 'alice', password: 'password1' },
  { id: 2, username: 'bob', password: 'password2' },
  { id: 3, username: 'charlie', password: 'password3' }
];
// Middleware to authenticate user with JWT
const authenticateUser = (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = decoded.sub;
    next();
  });
};

// Serve chat HTML page
app.get("/chat", authenticateUser, (req, res) => {
  res.sendFile(__dirname + "/chat.html");
});

// Handle login request
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if the username and password are valid
  const user = users.find((u) => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // Create a JWT token with the user ID as the payload
  const token = jwt.sign({ sub: user.id }, secret, { expiresIn: "1h" });
  res.status(200).json({ message: "Login successful" ,token});
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("chat message", (msg) => {
    console.log("message: " + msg);
    io.emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

http.listen(3000, () => {
  console.log("listening on *:3000");
});
