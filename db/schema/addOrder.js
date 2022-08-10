const mongoose = require("mongoose");

const addOrderSchema = new mongoose.Schema({
  customer: {
    type: String,
    required: true,
  },
  customerPhone: {
    type: Number,
    required: true,
  },
  orderDate: {
    type: String,
    required: true,
    default: () => {
      const date = new Date();
      const today = date.toLocaleDateString();
      return today;
    },
  },
  orderTime: {
    type: String,
    required: true,
    default: () => {
      const date = new Date();
      const time = date.toLocaleTimeString();
      return time;
    },
  },
  orderStatus: {
    type: String,
    required: true,
    default: "Placed",
  },
  orderQuantity: {
    type: Number,
    required: true,
  },
  orderTotal: {
    type: Number,
    required: true,
  },
});

const addOrder = mongoose.model("addOrder", addOrderSchema);
module.exports = addOrder;
