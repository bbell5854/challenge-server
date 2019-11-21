import { IFactory } from "../models/factory";

let instance: SocketIO.Server;

export function initMegaphone(io: SocketIO.Server) {
  if (!instance) {
    instance = io;
  }
}

function emitSession(payload: IFactory[]) {
  instance.sockets.emit("session.send", payload);
}

export default {
  emitSession,
};
