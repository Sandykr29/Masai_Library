const jwt = require("jsonwebtoken");
const { UserModel } = require("../model/user.model");

const auth = async (req, res, next) => {
    let token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ msg: "Login Please!" });
    try {
        const decoded = jwt.verify(token, "masai");
        const user = await UserModel.findById(decoded.userID);
        if (!user) return res.status(401).json({ msg: "User not found" });
        if (user.blocked) return res.status(403).json({ msg: "User is blocked" });
        req.user = user;
        next();
    } catch {
        res.status(401).json({ msg: "Invalid token" });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user.role === "admin") return next();
    res.status(403).json({ msg: "Admin access required" });
};

const isSeller = (req, res, next) => {
    if (req.user.role === "seller" || req.user.role === "admin") return next();
    res.status(403).json({ msg: "Seller access required" });
};

const isUser = (req, res, next) => {
    if (req.user.role === "user" || req.user.role === "admin") return next();
    res.status(403).json({ msg: "User access required" });
};

module.exports = {
    auth,
    isAdmin,
    isSeller,
    isUser
};