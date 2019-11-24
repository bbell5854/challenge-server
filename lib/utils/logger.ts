import bunyan from "bunyan";

const env = process.env.ENVIRONMENT;
const logger = bunyan.createLogger({
  name: "challenge-server",
  level: env === "prd" ? "info" : "debug",
});

export default logger;
