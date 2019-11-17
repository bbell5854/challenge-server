let instance: SocketIO.Server;

export function initMegaphone(io: SocketIO.Server) {
  if (!instance) {
    instance = io;
  }
}

// TODO: Change type to array of Factory's
function emitSession(payload: object) {
  instance.sockets.emit("session.send", payload);
}

export default {
  emitSession,
};
