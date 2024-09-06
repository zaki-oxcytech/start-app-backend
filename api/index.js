const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const authRoutes = require("../routes/auth");
const formRoutes = require("../routes/form");
const chatSupportRoutes = require("../routes/chatSupport");
const bodyParser = require("body-parser");
require("dotenv").config();
const app = express();
const http = require("http");
const { Server } = require("socket.io");

app.use(bodyParser.json());
// Middleware
app.use(express.json());

///////-----------------socket io-----------------///////

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Update to the React client URL
    methods: ["GET", "POST"],
  },
});

app.use(cors());

let users = {};

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("register", (userId) => {
    // console.log("Received userId:", userId);
    if (userId) {
      users[userId] = socket.id;
    }
    console.log("Updated users list:", users);
  });

  // Handle a new message event
  socket.on("message", (data) => {
    // console.log("message: ", data);
    io.emit("message", data); // Broadcast the message to all clients
  });

  socket.on("newUser", (data) => {
    // console.log("message: ", data);
    io.emit("newUser", data); // Broadcast to refresh get-all-users for supporter if new chat arrived
  });

  socket.on("disconnect", () => {
    // console.log("Client disconnected:", socket.id);
    for (let userId in users) {
      if (users[userId] === socket.id) {
        delete users[userId];
        break;
      }
    }
    console.log("Updated users list after disconnect:", users);
  });
});

// Middleware to add io to req
app.use((req, res, next) => {
  req.io = io;
  req.users = users;
  next();
});

///////-----------------socket io-----------------///////

app.use(helmet());

// Routes
app.use("/auth", authRoutes);
app.use("/form", formRoutes);
app.use("/chat-support", chatSupportRoutes);

app.get("/", (req, res) => {
  res.send("Working");
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
