import logger from "../utils/logger";
import factory from "./factory";

const connectionTopic = (socket: SocketIO.Socket): void => {
  logger.debug("Client connected");
  factory.initTopics(socket);
  socket.on("disconnect", () => logger.debug("Client disconnected"));

  const session = {};
  socket.emit("session", session);
};

const initConnectionListener = (io: SocketIO.Server): void => {
  io.on("connect", connectionTopic);
};

export default initConnectionListener;
