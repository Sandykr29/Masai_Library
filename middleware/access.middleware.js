
const access= (req,res,next)=>{
    
        if(req.body.isAdmin){
           
            next()
        }else{
            res.json({msg:"You are not authorised"})
        }
    }

module.exports={
    access
}