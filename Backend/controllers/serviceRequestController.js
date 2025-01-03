const sequelize = require("../config/db");


exports.addimg = async(req,res) => {
   try{
     res.json({message:"Image Uploaded"})
   }
   catch(error)
   {
      console.error("Error in adding image:", error.message);
      res.status(500).json({ error: error.message });
   }           
                  
  };
exports.addRequest = async(req,res) => {
 try{
    const {description,city_id,address,service_id}= req.body;
 const client_id=req.user.id;

 const query =`INSERT INTO ServiceRequests (description,city_id,address,service_id,client_id)
                values('${description}',${city_id},'${address}',${service_id},${client_id})`;
               const [result]= await sequelize.query(query);
               req.insertID=result;
                console.log(result);
                res.json({message:"Requests Sent!",result:result});
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
                const {sp_id}=req.params;
            const query =`select DISTINCT  sr.client_id as client_id,ci.name as city_name,c.name as 
            client_name,sr.address as address,s.name as service_name,sr.description as description,sr.request_id as request_id
             from ServiceRequests sr join clients c on c.client_id=sr.client_id 
            join Cities ci on ci.city_id=sr.city_id join Services s on s.service_id=sr.service_id  
            join ServiceProviders sp on sp.city_id=sr.city_id
            join ServiceProviderServices sps on sps.service_provider_id = sp.sp_id
            where sp.sp_id=${sp_id} and sr.service_id=sps.service_id and sps.availability_status=1  and sr.status='pending' ;
            `;
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
      const query=`select s.name ,sr.request_id ,sr.description,sr.address,sr.request_date 
      from ServiceRequests sr join services s on sr.service_id=s.service_id where client_id=${user_ID} and sr.status='pending'; `
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
      const {request_id,sp_id,price}=req.body;
      const query=`update ServiceRequests set status='accepted',price=${price} , sp_id=${sp_id} where request_id=${request_id}`;
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
      const query=`update ServiceRequests set status='pending' where request_id=${request_id}`;
      await sequelize.query(query);
      
   }
   catch(error)
   {
      console.error(error.message);
      res.status(500).json({error:error.message});
   }
};