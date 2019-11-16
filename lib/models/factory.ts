import db from "../database";

const factorySchema = new db.Schema({
  factoryId: {
    type: String,
    hashKey: true,
  },
  name: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: false,
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

const Factory = db.model("Factory", factorySchema);

export default Factory;
