import db from "../database";

export interface IFactory {
  factoryId: string;
  name: string;
  count: number;
  upperBound: number;
  lowerBound: number;
  childNodes: number[];
}

const factorySchema = new db.Schema({
  factoryId: {
    type: String,
    hashKey: true,
  },
  name: {
    type: String,
    required: true,
    rangeKey: true,
  },
  count: {
    type: Number,
    required: true,
  },
  upperBound: {
    type: Number,
    required: true,
  },
  lowerBound: {
    type: Number,
    required: true,
  },
  childNodes: {
    type: [Number],
    default: [],
  },
});

const Factory = db.model<IFactory, string>("Factory", factorySchema);

export default Factory;
