import uuid from "uuid/v4";
import Factory from "../models/factory";
import logger from "../utils/logger";
import nodes from "../utils/nodes";

const FACTORY_PREFIX = "factory";

interface ICreateRequest {
  name: string;
  count: number;
  upperBound: number;
  lowerBound: number;
}

interface IUpdateRequest {
  factoryId: string;
  name: string;
  count: number;
  upperBound: number;
  lowerBound: number;
}

interface IRegenerateRequest {
  factoryId: string;
}

interface IDisableRequest {
  factoryId: string;
}

async function create(payload: ICreateRequest): Promise<void> {
  logger.debug(`Received: ${FACTORY_PREFIX}.create`);
  // TODO: Need better validation here
  if (!payload || !payload.count || !payload.upperBound || !payload.lowerBound) {
    logger.debug("Invalid or missing values");

    // TODO: Should respond to the client with an error
    return;
  }

  try {
    const factoryId = uuid();
    const childNodes = nodes.generate(payload.count, payload.upperBound, payload.lowerBound);

    const factory = new Factory({
      factoryId,
      name: payload.name,
      active: true,
      count: payload.count,
      upperBound: payload.upperBound,
      lowerBound: payload.lowerBound,
      childNodes,
    });

    await factory.save();

  // TODO: Megaphone to all clients
  } catch (err) {
    logger.error(err);

    // TODO: Should respond to the client with the error
  }
}

function update(payload: IUpdateRequest): void {
  logger.debug(`Received: ${FACTORY_PREFIX}.update`);
}

function regenerate(payload: IRegenerateRequest): void {
  logger.debug(`Received: ${FACTORY_PREFIX}.regenerate`);
}

function disable(payload: IDisableRequest): void {
  logger.debug(`Received: ${FACTORY_PREFIX}.disable`);
}

function initTopics(socket: SocketIO.Socket): void {
  socket.on(`${FACTORY_PREFIX}.create`, create);
  socket.on(`${FACTORY_PREFIX}.disable`, disable);
  socket.on(`${FACTORY_PREFIX}.regenerate`, regenerate);
  socket.on(`${FACTORY_PREFIX}.update`, update);
}

export default {
  initTopics,
};
