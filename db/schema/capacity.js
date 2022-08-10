const mongoose = require("mongoose");

const orderCapacity = new mongoose.Schema({
  maxCapacity: {
    type: Number,
    required: true,
    default: 100,
  },
  todayCapacity: {
    type: Number,
    required: true,
    //set the today capacity to be the same as the order quantity
    default: 100,
  },
  date: {
    type: String,
    required: true,
    default: () => {
      const date = new Date();
      const today = date.toLocaleDateString();
      return today;
    },
  },
});

const capacity = mongoose.model("capacity", orderCapacity);
module.exports = capacity;
