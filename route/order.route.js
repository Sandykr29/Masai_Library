const express = require("express");
const { OrderModel } = require("../model/order.model");
const { auth, isAdmin } = require("../middleware/auth.middleware");

const orderRouter = express.Router();

// Create a new order (buy books)
orderRouter.post("/order", auth, async (req, res) => {
    try {
        const { books, totalAmount } = req.body;
        const newOrder = new OrderModel({ buyer: req.user._id, books, totalAmount });
        await newOrder.save();
        res.status(201).json({ msg: "Order placed successfully", order: newOrder });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

// Get all orders (admin only)
orderRouter.get("/orders", auth, isAdmin, async (req, res) => {
    try {
        let orders = await OrderModel.find().populate('buyer', 'name email').populate('books');
        res.status(200).json(orders);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

// Get my orders (user/seller)
orderRouter.get("/myorders", auth, async (req, res) => {
    try {
        let orders = await OrderModel.find({ buyer: req.user._id }).populate('books');
        res.status(200).json(orders);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

// Delete my order (user/seller)
orderRouter.delete("/myorders/:orderId", auth, async (req, res) => {
    try {
        const order = await OrderModel.findOne({ _id: req.params.orderId, buyer: req.user._id });
        if (!order) return res.status(404).json({ msg: "Order not found" });
        await OrderModel.deleteOne({ _id: req.params.orderId });
        res.status(200).json({ msg: "Order deleted" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

module.exports = {
    orderRouter
};