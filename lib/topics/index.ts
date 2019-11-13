const initConnectionTopics = (socket: SocketIO.Socket) => {
  console.log("Client connected");

  // Init topics for this specific connection
  socket.on("test", () => {
    console.log("Test Message Received");

    socket.emit("test", {
      message: "Test Message Received"
    });
  });

  socket.on("disconnect", () => console.log("Client disconnected"));
};

const initConnectionListener = (io: SocketIO.Server) => {
  io.on("connect", initConnectionTopics);
};

export default initConnectionListener;
