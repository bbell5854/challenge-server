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

const create = async (payload: ICreateRequest) => {
  console.log("create received");
};

const update = async (payload: IUpdateRequest) => {
  console.log("update received");
};

const regenerate = async (payload: IRegenerateRequest) => {
  console.log("regen received");
};

const disable = async (payload: IDisableRequest) => {
  console.log("disable received");
};

const initTopics = (socket: SocketIO.Socket) => {
  socket.on(`${FACTORY_PREFIX}.create`, create);
  socket.on(`${FACTORY_PREFIX}.disable`, disable);
  socket.on(`${FACTORY_PREFIX}.regenerate`, regenerate);
  socket.on(`${FACTORY_PREFIX}.update`, update);
};

export default {
  initTopics
};
