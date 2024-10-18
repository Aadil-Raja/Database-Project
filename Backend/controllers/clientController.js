// clientController.js
const Client = require("../models/client");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const sequelize = require('../config/db');

exports.createClient = async (req, res) => {
  try {
    const { name,email,password} = req.body;
    if (!name || !email || !password === undefined) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const checkEmailInSp = `SELECT * FROM ServiceProviders WHERE email = '${email}'`;
    const [spUser] = await sequelize.query(checkEmailInSp);

    // Check if the email already exists in the Clients table
    const checkEmailInClient = `SELECT * FROM Clients WHERE email = '${email}'`;
    const [clientUser] = await sequelize.query(checkEmailInClient);

    // If email exists in either table, return an error
    if (spUser.length > 0 || clientUser.length > 0) {
      return res.json({ message: "Email already exists" });
    }

    // SQL query to insert a new service provider
    const insertQuery = `
      INSERT INTO Clients 
      (name, email, password, createdAt, updatedAt)
      VALUES 
      ('${name}',  '${email}', '${hashedPassword}', NOW(), NOW());
    `;


    await sequelize.query(insertQuery);
  
    
    res.json({
      message: "User Created Successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getClient = async (req, res) => {
  try {
    const { client_id } = req.query; // Change to req.query for GET request
    const query = `SELECT name FROM clients WHERE client_id = ${client_id}`;
    const [result] = await sequelize.query(query);
    res.json(result[0]); // Send the first result
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOrders= async (req,res) => {

  try {
      const {client_id}=req.params;
      const query =`SELECT 
      f.rating as rating,f.review as review,
      sr.completed_date as completed_date ,
      sr.description as description ,
      (select name from cities c where sr.city_id =c.city_id) 
      as city,(select CONCAT(firstName, ' ', lastName)  
      from serviceproviders where sp_id=sr.sp_id) as 
      sp_name,s.name as name ,sr.address as address,sr.request_date as
       request_date,sr.status as status,sr.request_id as request_id from servicerequests sr join services s on  s.service_id = sr.service_id
       LEFT JOIN Feedback f ON sr.request_id = f.request_id
    
      where client_id=${client_id} order by sr.request_date desc`;
      const[result]=await sequelize.query(query);
      res.json(result);
  }
  catch(error)
  {
      
    
    res.status(500).json({ error: error.message });
  
  }
}

exports.updateOrder=async(req,res)=>{
  try {
   
    const {orderId}=req.params;
    const {status}=req.body;
    let query;
    if (status==='cancelled'){
      query =`UPDATE servicerequests 
      SET status = '${status}' 
      WHERE request_id = ${orderId};`;
    }
  else
  {
    if (status==='completed'){
      query =`UPDATE servicerequests 
      SET status = '${status}' ,completed_date=NOW() 
      WHERE request_id = ${orderId};`;
    }
  }

    await sequelize.query(query);
  }
  catch (error){
    res.status(500).json({ error: error.message });
  }
}

exports.addfeedback= async(req,res) =>
{
  try 
  {
              const {request_id,rating,comment}=req.body;
              const query =`insert into feedback(request_id,rating,review) values(${request_id},${rating},'${comment}');`;
              await sequelize.query(query);


  }
  catch (error){
    res.status(500).json({ error: error.message });
  }
}
