const express = require("express");
const router = express.Router();

const addOrder = require("../db/schema/addOrder");
const capacity = require("../db/schema/capacity");

router.get("/checkCapacity/:date", (req, res) => {
  const date = req.params.date;
  const newDate = date.split("-").join("/");
  console.log(newDate);
  capacity
    .findOne({ date: newDate }, (err, data) => {
      if (err) {
        res.send(err);
      } else {
        res.json({
          maxCapacity: data.maxCapacity,
          todayCapacity: data.maxCapacity - data.todayCapacity,
          date: data.date,
        });
      }
    })
    .sort({ date: -1 });
});

router.post("/addCapacity", (req, res) => {
  const data = req.body;
  const newCapacity = new capacity({
    maxCapacity: data.maxCapacity,
    todayCapacity: data.todayCapacity,
  });

  //update the capacity of the order
  capacity.findOneAndUpdate(
    {},
    {
      $set: {
        maxCapacity: data.maxCapacity,
        todayCapacity: data.todayCapacity,
        date: data.date,
      },
    },
    { new: true },
    (err, doc) => {
      if (err) {
        console.log(err);
      } else {
        console.log(doc);
        res.send(doc);
      }
    }
  );
});

router.post("/add", (req, res) => {
  const data = req.body;
  console.log(data);
  const newOrder = new addOrder(data);

  console.log(data.orderDate);
  if (
    data.orderDate === "" ||
    data.customer === "" ||
    data.customerPhone === "" ||
    data.orderQuantity === "" ||
    data.orderTotal === ""
  ) {
    res.json({
      msg: "Please fill in all fields",
    });
  } else {
    capacity.findOne({ date: data.orderDate }, (err, doc) => {
      if (err) {
        console.log(err);
      } else {
        console.log(doc);
        if (doc == null || doc.todayCapacity == null) {
          // console.log("no capacity");
          // res.send("no capacity");
          const newCapacity = new capacity({
            todayCapacity: data.orderQuantity,
            date: data.orderDate,
          });
          newCapacity.save((err, doc) => {
            if (err) {
              console.log(err);
            } else {
              newOrder.save((err, order) => {
                if (err) {
                  res.status(500).json({
                    error: err,
                  });
                } else {
                  res.status(200).json({
                    message: "Order added successfully",
                    order: order,
                  });
                }
              });
              console.log(doc);
            }
          });
        } else {
          const todayCapacity = doc.todayCapacity;
          const maxCapacity = doc.maxCapacity;
          if (todayCapacity == maxCapacity) {
            res.json({
              msg: "Out of stock today",
            });
          } else if (todayCapacity + data.orderQuantity > maxCapacity) {
            res.json({
              msg: `please enter quantity less than or equal to ${
                maxCapacity - todayCapacity
              }`,
            });
          } else {
            const orderQuantity = data.orderQuantity;
            const newTodayCapacity = todayCapacity + orderQuantity;
            capacity.updateOne(
              { _id: doc._id },
              { todayCapacity: newTodayCapacity },
              (err, doc) => {
                if (err) {
                  console.log(err);
                } else {
                  newOrder.save((err, order) => {
                    if (err) {
                      res.status(500).json({
                        error: err,
                      });
                    } else {
                      res.status(200).json({
                        message: "Order added successfully",
                        order: order,
                      });
                    }
                  });
                  console.log(doc);
                }
              }
            );
          }
        }
      }
    });
  }
});

router.get("/orders", (req, res) => {
  addOrder
    .find({}, (err, orders) => {
      if (err) {
        res.status(500).json({
          error: err,
        });
      } else {
        res.status(200).json({
          message: "Orders fetched successfully",
          orders: orders,
        });
      }
    })
    .sort({
      orderDate: -1,
    });
});

router.patch("/update/:id", (req, res) => {
  const id = req.params.id;
  const data = req.body;
  console.log(data);

  capacity.findOne({ date: data.orderDate }, (err, doc) => {
    if (err) {
      console.log(err);
    } else {
      console.log(doc);

      const todayCapacity = doc.todayCapacity;
      const maxCapacity = doc.maxCapacity;
      if (todayCapacity == maxCapacity) {
        res.json({
          msg: "Out of stock today",
        });
      } else if (todayCapacity + data.orderQuantity > maxCapacity) {
        res.json({
          msg: `please enter quantity less than or equal to ${
            maxCapacity - todayCapacity
          }`,
        });
      } else {
        const orderQuantity = data.orderQuantity;
        const newTodayCapacity = todayCapacity + orderQuantity;
        capacity.updateOne(
          { _id: doc._id },
          { todayCapacity: newTodayCapacity },
          (err, doc) => {
            if (err) {
              console.log(err);
            } else {
              addOrder.findByIdAndUpdate(id, data, (err, order) => {
                if (err) {
                  res.status(500).json({
                    error: err,
                  });
                } else {
                  res.status(200).json({
                    message: "Order updated successfully",
                    order: order,
                  });
                }
              });
            }
          }
        );
      }
    }
  });
});

router.patch("/updateStatus/:id", (req, res) => {
  const id = req.params.id;
  const data = req.body;
  addOrder
    .findByIdAndUpdate(id, data, (err, order) => {
      if (err) {
        res.status(500).json({
          error: err,
        });
      } else {
        res.status(200).json({
          message: "Order updated successfully",
          order: order,
        });
      }
    })
    .select("-_id -__v");
});

router.delete("/delete/:id", (req, res) => {
  const id = req.params.id;
  addOrder.findByIdAndDelete(id, (err, order) => {
    if (err) {
      res.status(500).json({
        error: err,
      });
    } else {
      res.status(200).json({
        message: "Order deleted successfully",
        order: order,
      });
    }
  });
});

router.get("/orders/:id", (req, res) => {
  const id = req.params.id;
  addOrder.findById(id, (err, order) => {
    if (err) {
      res.status(500).json({
        error: err,
      });
    } else {
      res.status(200).json({
        message: "Order fetched successfully",
        order: order,
      });
    }
  });
});

router.post("/checkCapacity/:id", (req, res) => {
  const id = req.params.id;
  const data = req.body;
  addOrder.findById(id, (err, order) => {
    if (err) {
      res.status(500).json({
        error: err,
      });
    } else {
      if (order.orderQuantity > data.orderQuantity) {
        res.status(200).json({
          message: "Order capacity is available",
          order: order,
        });
      } else {
        res.status(200).json({
          message: "Order capacity is not available",
          order: order,
        });
      }
    }
  });
});

router.get("/order/:id", (req, res) => {});

router.get("/", (req, res) => {
  res.send("Hello World from router");
});

module.exports = router;
