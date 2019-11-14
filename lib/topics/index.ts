import factory from "./factory";

const connectionTopic = (socket: SocketIO.Socket) => {
  console.log("Client connected");

  factory.initTopics(socket);

  socket.on("disconnect", () => console.log("Client disconnected"));
};

const initConnectionListener = (io: SocketIO.Server) => {
  io.on("connect", connectionTopic);
};

export default initConnectionListener;
