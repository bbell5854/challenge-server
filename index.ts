import http from "http";
import SocketIO from "socket.io";
import initConnectionListener from "./lib/topics";

const PORT = 8080;

const server = http.createServer();
const io = SocketIO(server);

initConnectionListener(io);
server.listen(PORT);
