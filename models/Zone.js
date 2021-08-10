const { Schema } = require('mongoose');

const zoneSchema = new Schema({
  number: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  area: {
    type: Number,
    required: true,
  },
});

module.exports = zoneSchema;
