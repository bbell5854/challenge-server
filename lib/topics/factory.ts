import uuid from "uuid/v4";
import {
  ERROR_RESPONSE_TOPIC,
  FACTORY_CREATE_TOPIC,
  FACTORY_DISABLE_TOPIC,
  FACTORY_UPDATE_TOPIC,
} from "../constants/topics";
import megaphone from "../megaphone";
import Factory, { IFactory } from "../models/factory";
import logger from "../utils/logger";
import nodes from "../utils/nodes";

function createWrapper(socket: SocketIO.Socket) {
  return async function create(payload: IFactory): Promise<void> {
    logger.debug(`Received: ${FACTORY_CREATE_TOPIC}`);

    if (
      !payload ||
      !payload.count ||
      !payload.upperBound ||
      !payload.lowerBound
    ) {
      logger.debug("Invalid or missing values");

      socket.emit(ERROR_RESPONSE_TOPIC, {
        message: "Create factory error: Invalid or missing values",
      });
      return;
    }

    // The UI should validate this, so if we get to this point lets default to the max.
    payload.count = nodes.minMaxCount(payload.count);

    try {
      const factoryId = uuid();
      const childNodes = nodes.generate(
        payload.count,
        payload.upperBound,
        payload.lowerBound,
      );

      const factory = new Factory({
        factoryId,
        name: payload.name,
        count: payload.count,
        upperBound: payload.upperBound,
        lowerBound: payload.lowerBound,
        childNodes,
      });

      await factory.save();

      const activeFactories = await Factory.scan().exec();
      megaphone.emitSession(activeFactories);
    } catch (err) {
      logger.error(err);

      socket.emit(ERROR_RESPONSE_TOPIC, {
        message: "Create factory error: Internal server error",
      });
    }
  };
}

function updateWrapper(socket: SocketIO.Socket) {
  return async function update(payload: IFactory): Promise<void> {
    logger.debug(`Received: ${FACTORY_UPDATE_TOPIC}`);

    if (!payload || !payload.factoryId) {
      logger.debug("Invalid or missing values");

      socket.emit(ERROR_RESPONSE_TOPIC, {
        message: "Update factory error: Invalid or missing values",
      });
      return;
    }

    // The UI should validate this, so if we get to this point lets default to the min/max.
    payload.count = nodes.minMaxCount(payload.count);

    try {
      const oldFactory = await Factory.get(payload.factoryId);
      if (!oldFactory) {
        socket.emit(ERROR_RESPONSE_TOPIC, {
          message: "Update factory error: Invalid factoryId",
        });

        return;
      }

      const factory = {
        ...oldFactory,
        ...payload,
      };

      const childNodes = nodes.generate(
        factory.count,
        factory.upperBound,
        factory.lowerBound,
      );
      factory.childNodes = childNodes;

      await Factory.update(payload.factoryId, factory);

      const activeFactories = await Factory.scan().exec();
      megaphone.emitSession(activeFactories);
    } catch (err) {
      logger.error(err);

      socket.emit(ERROR_RESPONSE_TOPIC, {
        message: "Update factory error: Internal server error",
      });
    }
  };
}

function disableWrapper(socket: SocketIO.Socket) {
  return async function disable(payload: IFactory): Promise<void> {
    logger.debug(`Received: ${FACTORY_DISABLE_TOPIC}`);

    if (!payload || !payload.factoryId) {
      logger.debug("Invalid or missing values");

      socket.emit(ERROR_RESPONSE_TOPIC, {
        message: "Disable factory error: Invalid or missing values",
      });
      return;
    }

    try {
      await Factory.delete(payload.factoryId);

      const activeFactories = await Factory.scan().exec();
      megaphone.emitSession(activeFactories);
    } catch (err) {
      logger.error(err);

      socket.emit(ERROR_RESPONSE_TOPIC, {
        message: "Disable factory error: Internal server error",
      });
    }
  };
}

function initTopics(socket: SocketIO.Socket): void {
  socket.on(FACTORY_CREATE_TOPIC, createWrapper(socket));
  socket.on(FACTORY_UPDATE_TOPIC, updateWrapper(socket));
  socket.on(FACTORY_DISABLE_TOPIC, disableWrapper(socket));
}

export default {
  initTopics,
};
