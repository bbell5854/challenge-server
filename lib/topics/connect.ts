import Factory from "../models/factory";
import logger from "../utils/logger";
import factoryTopic from "./factory";

async function connect(socket: SocketIO.Socket): Promise<void> {
  logger.debug("Client connected");
  factoryTopic.initTopics(socket);
  socket.on("disconnect", () => logger.debug("Client disconnected"));

  try {
    const activeFactories = await Factory.scan("active").eq(true).exec();
    socket.emit("session.send", activeFactories);
  } catch (err) {
    logger.error(err);
    // TODO: Emit error to client
  }
}

export default connect;
