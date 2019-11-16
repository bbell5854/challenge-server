import dynamoose from "dynamoose";
import http from "http";
import SocketIO from "socket.io";
import initConnectionListener from "./lib/topics";
import logger from "./lib/utils/logger";

const PORT = 8080;

dynamoose.AWS.config.update({
  accessKeyId: process.env.DYNAMO_ACCESS_KEY,
  secretAccessKey: process.env.DYNAMO_SECRET_KEY,
  region: "us-east-1",
});

const server = http.createServer();
const io = SocketIO(server);

initConnectionListener(io);
server.listen(PORT, () => {
  logger.info(`Listening on port ${PORT}`);
});
