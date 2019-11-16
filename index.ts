import http from "http";
import SocketIO from "socket.io";
import initConnectionListener from "./lib/topics";
import logger from "./lib/utils/logger";

const PORT = 8080;

const server = http.createServer();
const io = SocketIO(server);

initConnectionListener(io);
server.listen(PORT, () => {
  logger.info(`Listening on port ${PORT}`);
});
