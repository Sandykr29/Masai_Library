const mongoose=require("mongoose")

const bookSchema=mongoose.Schema({
    title:String,
    author:String,
    category:String,
    price:Number,
    quantity:Number,
    owner:{type:mongoose.Schema.Types.ObjectId,ref:'user'} // seller reference
},{
    versionKey:false
})

const BookModel=mongoose.model("book",bookSchema)

module.exports={
    BookModel
}