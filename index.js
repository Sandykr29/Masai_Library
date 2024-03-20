const express=require("express");
const { Connection } = require("./db");
const { userRouter } = require("./route/user.route");
const { bookRouter } = require("./route/book.route");
const {orderRouter} = require("./route/order.route")
const app=express();

app.use(express.json());
app.use("/api",userRouter);
app.use("/api",bookRouter)
app.use("/api",orderRouter)


app.listen(8000,async()=>{
    try {
        await Connection;
        console.log("Connected to DB")
        console.log("Server is running at port 8000")
    } catch (error) {
        console.log("error due to",error.message)
    }
})