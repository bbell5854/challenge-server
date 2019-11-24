import dynamoose from "dynamoose";

dynamoose.AWS.config.update({
  accessKeyId: process.env.DYNAMO_ACCESS_KEY,
  secretAccessKey: process.env.DYNAMO_SECRET_KEY,
  region: "us-east-1",
});

export default dynamoose;
