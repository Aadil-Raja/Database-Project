const User = require("../models/user")

exports.createuser= async (req,res)=>{
    try{
        const {firstName,lastName}=req.body;
        const newUser= await User.create({firstName,lastName});
        res.json({message:"User Created Succesfully",
            user:newUser
        })
    }
    catch(err)
    {
        res.json({error:err.message});
    }
}