const jwt=require("jsonwebtoken")
const {UserModel}=require("../model/user.model");


const auth=async(req,res,next)=>{

    const token=req.headers.authorization?.split(" ")[1];
    
    if(token){
        try {
            const decoded=jwt.verify(token,"masai");
            const {userID}=decoded;

            //make is async await function else it'll throw erro, because it won't be able to get the data by that time
            const user=await UserModel.findOne({_id:userID});
            console.log(user.isAdmin?"Yes":"No")
            req.body.isAdmin=user.isAdmin;
            next();
        } catch (error) {
            res.json({error})
        }
    }
    else{
        res.json({msg:"Login Please!"})
    }
}

module.exports={
    auth
}