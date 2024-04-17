const setupSocket = require("./src/sockets/sockets");
const connectMongoDB = require("./db");
const { createServer } = require("http");
const { Server } = require("socket.io");
const express = require("express");
const cors = require("cors");
const initRoutes = require("./src/routes/index");
require("dotenv").config();

const app = express();
const port = process.env.PORT;

app.use(express.json());

app.use(
  cors({
    origin: "*"
  })
);

connectMongoDB();

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
initRoutes(app);

setupSocket(io);
httpServer.listen(5000);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
