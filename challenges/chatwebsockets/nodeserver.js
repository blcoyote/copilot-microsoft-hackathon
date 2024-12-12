"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Import required modules
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
// Serve static files from the 'public' directory
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
// Serve index.html on path /
app.get("/", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "index.html"));
});
// Store chat history
let chatHistory = [];
// Handle socket connections
const handleSocketConnection = (socket) => {
    console.log("a Mjolner employee connected");
    // Send chat history to new user
    socket.emit("chat history", chatHistory);
    // Handle incoming chat messages
    socket.on("chat message", (msg) => {
        chatHistory.push(msg); // Add message to chat history
        if (chatHistory.length > 50) {
            chatHistory.shift(); // Remove the oldest message if history exceeds 50 lines
        }
        io.emit("chat message", msg); // Broadcast the message to all connected clients
    });
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
