require('dotenv').config();
const http = require('http');
const app = require('../app');
const connectDB = require('./config/db');
const { initSocket } = require('./config/socket');

const PORT = process.env.PORT || 3000;

(async () => {
    try {
        await connectDB();
    } catch (err) {
        console.error('MongoDB connection failed:', err);
    }

    const server = http.createServer(app);
    initSocket(server);

    server.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
})();
