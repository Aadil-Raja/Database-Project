const Client = require("../models/client")
const Sp =require("../models/Sp");

exports.createClient= async (req,res)=>{
    try{
        const {firstName,lastName,email,password,tips,terms}=req.body;
        if (!firstName || !lastName || !email || !password || terms === undefined) {
            return res.status(400).json({ message: 'All fields are required.' });
          }   
        const newUser= await Client.create({firstName,lastName,email,password,tips,terms});
        res.json({message:"User Created Succesfully",
            user:newUser
        })
    }
    catch(err)
    {
        res.json({error:err.message});
    }
}


exports.createSp= async (req,res)=>{
    try{
        const {firstName,lastName,email,password,tips,terms}=req.body;
        if (!firstName || !lastName || !email || !password || terms === undefined) {
            return res.status(400).json({ message: 'All fields are required.' });
          }   
        const newUser= await Sp.create({firstName,lastName,email,password,tips,terms});
        res.json({message:"User Created Succesfully",
            user:newUser
        })
    }
    catch(err)
    {
        res.json({error:err.message});
    }
}