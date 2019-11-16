import bunyan from "bunyan";

const logger = bunyan.createLogger({
  name: "challenge-server",
});

export default logger;
