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
    required: false,
  },
  area: {
    type: Number,
    required: false,
  },
});

module.exports = zoneSchema;
