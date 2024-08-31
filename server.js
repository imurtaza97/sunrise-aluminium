require('dotenv').config(); // Load environment variables

const express = require("express");
const next = require("next");
const http = require("http");
const socketIO = require("socket.io");
const cors = require("cors");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const PORT = process.env.SERVER_PORT || 4000;

app.prepare().then(() => {
    const server = express();
    const httpServer = http.createServer(server);
    const io = socketIO(httpServer, {
        cors: {
            origin: "https://sunrisealuminium.vercel.app/admin/dashboard", // Update this with your frontend URL
        },
    });

    // Middleware
    server.use(express.urlencoded({ extended: true }));
    server.use(express.json());
    server.use(cors());

    // Socket.IO connection
    io.on('connection', (socket) => {
        socket.on('disconnect', () => {
        });
    });

    // API route for notifications
    server.post("/api", (req, res) => {
        const { name, message } = req.body;
        io.emit('notification', { name, message });
        res.status(200).json({ name, message });
    });

    // Default Next.js handler for all other routes
    server.all("*", (req, res) => {
        return handle(req, res);
    });

    // Start the server
    httpServer.listen(PORT, (err) => {
        if (err) throw err;
    });
});



// // server.js
// require('dotenv').config(); // Add this at the top

// const express = require("express");
// const app = express();
// const PORT = process.env.PORT || 4000;

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// // New imports
// const http = require("http").Server(app);
// const cors = require("cors");

// app.use(cors());

// const socketIO = require('socket.io')(http, {
//     cors: {
//         origin: "*"
//     }
// });

// // Add this before the app.get() block
// socketIO.on('connection', (socket) => {
//     console.log(`⚡: ${socket.id} user just connected!`);

//     socket.on('disconnect', () => {
//         console.log('🔥: A user disconnected');
//     });
// });

// app.post("/api", (req, res) => {
//     const { name, message } = req.body;
//     socketIO.emit('notification', { name, message });
//     console.log(name, message);

//     res.status(200).json({ name, message });
// });

// http.listen(PORT, () => {
//     console.log(`Server listening on ${PORT}`);
// });