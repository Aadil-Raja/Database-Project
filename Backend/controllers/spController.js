const bcrypt = require("bcryptjs");
const sequelize = require("../config/db");

exports.createSp = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, address, city_id, gender, dob } = req.body;

    if (!firstName || !lastName || !email || !password || !phone || !address || !city_id || !gender || !dob ) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Hash the password
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
      INSERT INTO ServiceProviders 
      (firstName, lastName, email, password, phone, address, city_id, gender, dob, createdAt, updatedAt)
      VALUES 
      ('${firstName}', '${lastName}', '${email}', '${hashedPassword}', '${phone}', '${address}', ${city_id}, '${gender}', '${dob}',  NOW(), NOW());
    `;

    // Execute the query
    await sequelize.query(insertQuery);

    res.json({ message: "User Created Successfully"});
  } catch (err) {
    console.error("Error in createSp:", err.message);
    res.status(500).json({ error: err.message });
  }
};


exports.getOrders= async (req,res) => {

  try {
      const {sp_id}=req.params;
      const query =`SELECT 
      (select name from Clients c where c.client_id=sr.client_id) as client_name,f.rating as rating,f.review as review,f.created_at as review_date,
      sr.completed_date as completed_date ,
      sr.price as price,
      sr.description as description ,
      (select name from Cities c where sr.city_id =c.city_id) 
      as city,(select CONCAT(firstName, ' ', lastName)  
      from ServiceProviders where sp_id=sr.sp_id) as 
      sp_name,s.name as name ,sr.address as address,sr.request_date as
       request_date,sr.status as status,sr.request_id as request_id from ServiceRequests sr join Services s on  s.service_id = sr.service_id
       LEFT JOIN Feedbacks f ON sr.request_id = f.request_id
    
      where sp_id=${sp_id} order by sr.request_date desc`;
      const[result]=await sequelize.query(query);
      res.json(result);
  }
  catch(error)
  {
      
    
    res.status(500).json({ error: error.message });
  
  }
}