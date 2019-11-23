import { DISCONNECT_TOPIC, SESSION_EMIT_TOPIC } from "../constants/topics";
import Factory from "../models/factory";
import logger from "../utils/logger";
import factoryTopic from "./factory";

async function connect(socket: SocketIO.Socket): Promise<void> {
  logger.debug("Client connected");
  factoryTopic.initTopics(socket);
  socket.on(DISCONNECT_TOPIC, () => logger.debug("Client disconnected"));

  try {
    const activeFactories = await Factory.scan().exec();
    socket.emit(SESSION_EMIT_TOPIC, activeFactories);
  } catch (err) {
    logger.error(err);
  }
}

export default connect;
