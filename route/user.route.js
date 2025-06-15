const express = require("express");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { UserModel } = require("../model/user.model");
const { OrderModel } = require("../model/order.model");
const { BookModel } = require("../model/book.model");
const { auth, isAdmin } = require("../middleware/auth.middleware");

const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
    const { name, email, password, role } = req.body;
    let user = await UserModel.findOne({ email });
    if (user) return res.status(409).json({ msg: "User already exists, Kindly Login with credentials!" });
    try {
        let hash = await bcrypt.hash(password, 5);
        let newUser = new UserModel({ name, email, password: hash, role: role || "user" });
        await newUser.save();
        res.status(201).json({ msg: "New User Added" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    let user = await UserModel.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User does not exist, kindly register the user" });
    if (user.blocked) return res.status(403).json({ msg: "User is blocked" });
    try {
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ msg: "Wrong Credentials" });
        const token = jwt.sign({ userID: user._id }, 'masai');
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "strict",
            // secure: true, // Uncomment if using HTTPS
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });
        res.status(200).json({ msg: "Login Successful!", role: user.role });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

// Logout route
userRouter.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ msg: "Logout successful" });
});

// Admin: get all users/sellers
userRouter.get("/users", auth, isAdmin, async (req, res) => {
    try {
        const users = await UserModel.find({}, { password: 0 });
        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

// Admin: block/unblock user or seller
userRouter.patch("/users/:id/block", auth, isAdmin, async (req, res) => {
    try {
        await UserModel.findByIdAndUpdate(req.params.id, { blocked: true });
        res.status(200).json({ msg: "User/Seller blocked" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});
userRouter.patch("/users/:id/unblock", auth, isAdmin, async (req, res) => {
    try {
        await UserModel.findByIdAndUpdate(req.params.id, { blocked: false });
        res.status(200).json({ msg: "User/Seller unblocked" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

// Admin: delete user/seller
userRouter.delete("/users/:id", auth, isAdmin, async (req, res) => {
    try {
        await UserModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ msg: "User/Seller deleted" });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

// Admin: delete all users, books, and orders (clean database)
userRouter.delete("/clean", auth, isAdmin, async (req, res) => {
    try {
        await UserModel.deleteMany({});
        await BookModel.deleteMany({});
        await OrderModel.deleteMany({});
        res.status(200).json({ msg: "Database cleaned: all users, books, and orders deleted." });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

// User: get own orders
userRouter.get("/myorders", auth, async (req, res) => {
    try {
        const orders = await OrderModel.find({ buyer: req.user._id }).populate('books');
        res.status(200).json(orders);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});

// User: delete order (from buy list)
userRouter.delete("/myorders/:orderId", auth, async (req, res) => {
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
    userRouter
};