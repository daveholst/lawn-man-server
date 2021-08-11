const { Schema } = require('mongoose');

const zoneSchema = new Schema({
  stationNumber: {
    type: Number,
    required: true,
  },
  stationName: {
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
