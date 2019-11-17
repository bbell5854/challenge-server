import http from "http";
import SocketIO from "socket.io";
import { initMegaphone } from "./lib/megaphone";
import connectionTopic from "./lib/topics/connect";
import logger from "./lib/utils/logger";

const PORT = 8080;

const server = http.createServer();
const io = SocketIO(server);

initMegaphone(io);
io.on("connect", connectionTopic);

server.listen(PORT, () => {
  logger.info(`Listening on port ${PORT}`);
});
