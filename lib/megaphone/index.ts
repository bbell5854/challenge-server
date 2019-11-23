import { SESSION_EMIT_TOPIC } from "../constants/topics";
import { IFactory } from "../models/factory";

let instance: SocketIO.Server;

export function initMegaphone(io: SocketIO.Server) {
  if (!instance) {
    instance = io;
  }
}

function emitSession(payload: IFactory[]) {
  instance.sockets.emit(SESSION_EMIT_TOPIC, payload);
}

export default {
  emitSession,
};
