import http from "http";
import SocketIO from "socket.io";
import { CONNECT_TOPIC } from "./lib/constants/topics";
import { initMegaphone } from "./lib/megaphone";
import connectionTopic from "./lib/topics/connect";
import logger from "./lib/utils/logger";

const PORT = 8080;

const server = http.createServer((req, res) => {
  const { url } = req;

  const healthObj = {
    status: "OK",
  };

  if (url === "/health") {
    res.write(JSON.stringify(healthObj));
    res.end();
  }
});
const io = SocketIO(server);

initMegaphone(io);
io.on(CONNECT_TOPIC, connectionTopic);

server.listen(PORT, () => {
  logger.info(`Listening on port ${PORT}`);
});
