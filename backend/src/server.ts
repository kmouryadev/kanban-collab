import http from "http";
import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import connectDB from "./config/db";
import { initSocket } from "./socket";
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

connectDB();
initSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
