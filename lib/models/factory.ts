import { Schema, model } from 'dynamoose';

const factorySchema = new Schema({
  factoryId: {
    type: Number,
    hashKey: true
  },
  name: {
    type: String,
    required: true
  },
  count: {
    type: String,
    required: true
  },
  upperBound: {
    type: String,
    required: true
  },
  lowerBound: {
    type: String,
    required: true
  },
  childNodes: {
    type: [Number],
    default: []
  },
  active: {
    type: Boolean,
    index: true
  }
});

const Factory = model('Factory', factorySchema);

export default Factory;
