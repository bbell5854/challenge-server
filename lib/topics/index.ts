import factory from "./factory";

const connectionTopic = (socket: SocketIO.Socket): void => {
  console.log("Client connected");
  factory.initTopics(socket);
  socket.on("disconnect", () => console.log("Client disconnected"));

  const session = {};
  socket.emit("session", session);
};

const initConnectionListener = (io: SocketIO.Server): void => {
  io.on("connect", connectionTopic);
};

export default initConnectionListener;
