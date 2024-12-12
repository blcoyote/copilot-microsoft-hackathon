// Import required modules
import express from "express";
import http from "http";
import { Server, Socket } from "socket.io";
import path from "path";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Serve index.html on path /
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Store chat history
let chatHistory: {
  username: string;
  text: string;
  color: string;
  type: string;
  data?: string;
}[] = [];

// Handle socket connections
const handleSocketConnection = (socket: Socket) => {
  console.log("a Mjolner employee connected");

  // Send chat history to new user
  socket.emit("chat history", chatHistory);

  // Handle incoming chat messages
  socket.on(
    "chat message",
    (msg: {
      username: string;
      text: string;
      color: string;
      type: string;
      data?: string;
    }) => {
      chatHistory.push(msg); // Add message to chat history
      if (chatHistory.length > 50) {
        chatHistory.shift(); // Remove the oldest message if history exceeds 50 lines
      }
      io.emit("chat message", msg); // Broadcast the message to all connected clients
    }
  );

  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log("Mjolner employee disconnected");
  });
};

// Attach the connection handler to the socket.io server
io.on("connection", handleSocketConnection);

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
