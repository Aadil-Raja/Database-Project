const sequelize = require("../config/db");

exports.addRequest = async(req,res) => {
 try{
    const {description,city_id,address,service_id}= req.body;
 const client_id=req.user.id;

 const query =`INSERT INTO servicerequests (description,city_id,address,service_id,client_id)
                values('${description}',${city_id},'${address}',${service_id},${client_id})`;
                await sequelize.query(query);
                res.json("Requests Sent!");
 }
 catch(error)
 {
    console.error("Error in adding request:", error.message);
    res.status(500).json({ error: error.message });
 }           
                
};

exports.getallRequests = async(req,res) => {
     try 
     {
            const query =`select * from servicerequests;`;
               const [requests]= await sequelize.query(query);
                res.json(requests);        
        }
        catch(error)
        {
            console.error("Error in getting request:",error.message);
            res.status(500).json({error:error.message});
        }
}
