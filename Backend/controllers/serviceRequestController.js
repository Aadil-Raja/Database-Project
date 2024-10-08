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

exports.getPendingRequestofClient= async(req,res)=> {
   try {
      const {user_ID}=req.body;
      const query=`select s.name ,sr.request_id from servicerequests sr join services s on sr.service_id=s.service_id where client_id=${user_ID} and sr.status='pending'; `
      const [results]= await sequelize.query(query);
      res.json(results);
   }
   catch(error)
   {
      console.error(error.message);
      res.status(500).json({error:error.message});
   }
}

exports.addAcceptedRequest=async(req,res)=>{
   try {
      const {request_id}=req.body;
      const query=`update servicerequests set status='accepted' where request_id=${request_id}`;
      await sequelize.query(query);
      
   }
   catch(error)
   {
      console.error(error.message);
      res.status(500).json({error:error.message});
   }
}

exports.cancelServiceRequest= async(req,res)=>{

   try {
      const {request_id}=req.body;
      const query=`update servicerequests set status='pending' where request_id=${request_id}`;
      await sequelize.query(query);
      
   }
   catch(error)
   {
      console.error(error.message);
      res.status(500).json({error:error.message});
   }
};