import uuid from "uuid/v4";
import megaphone from "../megaphone";
import Factory, { IFactory } from "../models/factory";
import logger from "../utils/logger";
import nodes from "../utils/nodes";

const FACTORY_PREFIX = "factory";

function createWrapper(socket: SocketIO.Socket) {
  return async function create(payload: IFactory): Promise<void> {
    logger.debug(`Received: ${FACTORY_PREFIX}.create`);

    if (!payload || !payload.count || !payload.upperBound || !payload.lowerBound) {
      logger.debug("Invalid or missing values");

      socket.emit(`${FACTORY_PREFIX}.create.response`, {
        message: "Invalid or missing values",
        err: true,
      });
      return;
    }

    // The UI should validate this, so if we get to this point lets default to the max.
    if (payload.count > 15) {
      payload.count = 15;
    }

    try {
      const factoryId = uuid();
      const childNodes = nodes.generate(payload.count, payload.upperBound, payload.lowerBound);

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

      socket.emit(`${FACTORY_PREFIX}.create.response`, {
        message: "Internal server error",
        err: true,
      });
    }
  };
}

function updateWrapper(socket: SocketIO.Socket) {
  return async function update(payload: IFactory): Promise<void> {
    logger.debug(`Received: ${FACTORY_PREFIX}.update`);

    if (!payload || !payload.factoryId) {
      logger.debug("Invalid or missing values");

      socket.emit(`${FACTORY_PREFIX}.create.response`, {
        message: "Invalid or missing values",
        err: true,
      });
      return;
    }

    // The UI should validate this, so if we get to this point lets default to the max.
    if (payload.count > 15) {
      payload.count = 15;
    }

    try {
      const oldFactory = await Factory.get(payload.factoryId);
      if (!oldFactory) {
        socket.emit(`${FACTORY_PREFIX}.regenerate.response`, {
          message: "Invalid factoryId",
          err: true,
        });

        return;
      }

      const factory = {
        ...oldFactory,
        ...payload,
      };

      const childNodes = nodes.generate(factory.count, factory.upperBound, factory.lowerBound);
      factory.childNodes = childNodes;

      await Factory.update(payload.factoryId, factory);

      const activeFactories = await Factory.scan().exec();
      megaphone.emitSession(activeFactories);
    } catch (err) {
      logger.error(err);

      socket.emit(`${FACTORY_PREFIX}.create.response`, {
        message: "Internal server error",
        err: true,
      });
    }
  };
}

function regenerateWrapper(socket: SocketIO.Socket) {
  return async function regenerate(payload: IFactory): Promise<void> {
    logger.debug(`Received: ${FACTORY_PREFIX}.regenerate`);

    if (!payload || !payload.factoryId) {
      logger.debug("Invalid or missing values");

      socket.emit(`${FACTORY_PREFIX}.regenerate.response`, {
        message: "Invalid or missing values",
        err: true,
      });
      return;
    }

    try {
      const factory = await Factory.get(payload.factoryId);
      if (!factory) {
        socket.emit(`${FACTORY_PREFIX}.regenerate.response`, {
          message: "Invalid factoryId",
          err: true,
        });

        return;
      }

      const childNodes = nodes.generate(factory.count, factory.upperBound, factory.lowerBound);
      factory.childNodes = childNodes;

      await factory.save();

      const activeFactories = await Factory.scan().exec();
      megaphone.emitSession(activeFactories);
    } catch (err) {
      logger.error(err);

      socket.emit(`${FACTORY_PREFIX}.regenerate.response`, {
        message: "Internal server error",
        err: true,
      });
    }
  };
}

function disableWrapper(socket: SocketIO.Socket) {
  return async function disable(payload: IFactory): Promise<void> {
    logger.debug(`Received: ${FACTORY_PREFIX}.disable`);

    if (!payload || !payload.factoryId) {
      logger.debug("Invalid or missing values");

      socket.emit(`${FACTORY_PREFIX}.disable.response`, {
        message: "Invalid or missing values",
        err: true,
      });
      return;
    }

    try {
      await Factory.delete(payload.factoryId);

      const activeFactories = await Factory.scan().exec();
      megaphone.emitSession(activeFactories);
    } catch (err) {
      logger.error(err);

      socket.emit(`${FACTORY_PREFIX}.disable.response`, {
        message: "Internal server error",
        err: true,
      });
    }
  };
}

function initTopics(socket: SocketIO.Socket): void {
  socket.on(`${FACTORY_PREFIX}.create`, createWrapper(socket));
  socket.on(`${FACTORY_PREFIX}.disable`, disableWrapper(socket));
  socket.on(`${FACTORY_PREFIX}.regenerate`, regenerateWrapper(socket));
  socket.on(`${FACTORY_PREFIX}.update`, updateWrapper(socket));
}

export default {
  initTopics,
};
