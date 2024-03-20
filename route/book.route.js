const express=require("express");
const { BookModel } = require("../model/book.model");
const {auth}=require("../middleware/auth.middleware")
const {access}=require("../middleware/access.middleware")

const bookRouter=express.Router();

bookRouter.get("/books",async(req,res)=>{
    try {
        let books=await BookModel.find();
        res.status(200).json(books)
    } catch (error) {
        res.status(400).json({msg:error.message});
    }
})

bookRouter.get("/books/:id",async(req,res)=>{
    const {id}=req.params;
    let book=await BookModel.findOne({_id:id});
    if(!book){return res.status(400).json({msg:"No book Avaialbe with given id, kindly check for another id"})}
    try {
        
        res.status(200).json(book)
    } catch (error) {
        res.status(400).json({msg:error.message});
    }
})

bookRouter.post("/books",auth,access,async(req,res)=>{
    try {
        let newBook=new BookModel(req.body);
        await newBook.save();
        res.status(201).json({msg:"New Book Added..."})
    } catch (error) {
        res.status(400).json({msg:error.message})
    }
})

bookRouter.get("/books", async (req, res) => {
    try {
        const { category, author } = req.query;
        let query = {};
        if (category) {
            query.category = category;
        }
        if (author) {
            query.author = author;
        }
        let books = await BookModel.find(query);
        res.status(200).json(books);
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
});


bookRouter.patch("/books/:id",auth,access,async(req,res)=>{
    const {id}=req.params;
   try {
    await BookModel.findByIdAndUpdate({_id:id},req.body)
    res.status(204).json({msg:`Book this ${id} updated`})// on putting status code 204, res is not getting printed
    // res.status(204).json({msg:"Details Updated"})
   } catch (error) {
    res.status(400).json({error:error.message})
   }
    
})

bookRouter.delete("/books/:id",auth,access,async(req,res)=>{
    const {id}=req.params;
   try {
    await BookModel.findByIdAndDelete({_id:id})
    res.status(202).json({msg:`Book with ID:${id} has been Deleted`})
   } catch (error) {
    res.status(400).json({error:error.message})
   }
    
})


module.exports={
    bookRouter
}