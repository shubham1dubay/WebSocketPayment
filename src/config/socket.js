let io;

const initSocket = (server) => {
    const { Server } = require("socket.io");
    io = new Server(server, { cors: { origin: "*" } });

    io.on("connection", (socket) => {
        console.log("WebSocket connected:", socket.id);
    });
};

const getIO = () => io;

module.exports = { initSocket, getIO };
