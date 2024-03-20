const express=require("express");
const { OrderModel } = require("../model/order.model");
const {auth}=require("../middleware/auth.middleware")
const {access}=require("../middleware/access.middleware")

const orderRouter=express.Router();

orderRouter.post("/order", async (req, res) => {
   
});

orderRouter.get("/orders",auth,access,async(req,res)=>{
let orders=await OrderModel();
res.status(200).send(orders)
})


module.exports={
    orderRouter
}