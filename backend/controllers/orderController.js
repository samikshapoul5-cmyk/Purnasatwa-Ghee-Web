const Order = require("../models/Order");

// CREATE ORDER
exports.createOrder = async (req, res) => {
  try {
    const { userId, products, totalAmount } = req.body;

    const order = await Order.create({
      userId,
      products,
      totalAmount
    });

    res.status(201).json({
      message: "Order created successfully",
      orderId: order._id
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// GET ORDER BY ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("products.productId", "name price image");

    if (!order) {
      return res.status(404).json({
        message: "Order not found"
      });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// GET USER ORDERS
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      userId: req.params.userId
    })
      .populate("products.productId", "name price image")
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};