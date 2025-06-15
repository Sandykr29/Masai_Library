const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }, // who bought
    books: [{ type: mongoose.Schema.Types.ObjectId, ref: 'book' }],
    totalAmount: Number
}, {
    versionKey: false
});

const OrderModel = mongoose.model("order", orderSchema);

module.exports = {
    OrderModel
};
