import Factory from '../models/factory';
const FACTORY_PREFIX = "factory";

interface ICreateRequest {
  name: string;
  count: number;
  upperBound: number;
  lowerBound: number;
}

interface IUpdateRequest {
  guid: string;
  name: string;
  count: number;
  upperBound: number;
  lowerBound: number;
}

interface IRegenerateRequest {
  guid: string;
}

interface IDisableRequest {
  guid: string;
}

function generateChildNodes(count: number, upperBound: number, lowerBound: number): Array<number> {
  const childNodes = [];

  for (let i = 0; i < count; i++) {
    const randNumb = Math.floor(Math.random() * (upperBound - lowerBound) + lowerBound);
    childNodes.push(randNumb);
  }

  return childNodes.sort((a, b) => (a - b));
};

async function create(payload: ICreateRequest): Promise<void> {
  console.log("create received");
  try {
    if (!payload || !payload.count || !payload.upperBound || !payload.lowerBound) {
      throw new Error('Invalid or missing parameters');
    }

    const childNodes = generateChildNodes(payload.count, payload.upperBound, payload.lowerBound);

    const factory = new Factory({
      name: payload.name,
      count: payload.count,
      upperBound: payload.upperBound,
      lowerBound: payload.lowerBound,
      childNodes,
      active: true
    });

    await factory.save();

  // TODO: Megaphone to all clients
  } catch (err) {
    console.error(err);
  }
};

function update(payload: IUpdateRequest): void {
};

function regenerate(payload: IRegenerateRequest): void {
  console.log("regen received");
};

function disable(payload: IDisableRequest): void {
  console.log("disable received");
};

function initTopics(socket: SocketIO.Socket): void {
  socket.on(`${FACTORY_PREFIX}.create`, create);
  socket.on(`${FACTORY_PREFIX}.disable`, disable);
  socket.on(`${FACTORY_PREFIX}.regenerate`, regenerate);
  socket.on(`${FACTORY_PREFIX}.update`, update);
};

export default {
  initTopics
};
