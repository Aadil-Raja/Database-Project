const sequelize = require('../config/db');
const jwt = require('jsonwebtoken');
// Controller to add a new category and return all categories

exports.login= async(req,res)=>
{
         const {username,password}=req.body;
         if(username===process.env.ADMIN_USERNAME && password ===process.env.ADMIN_PASSWORD)
         {
          const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
          res.json({ message: "Successful",token});
          

         }
         else
         {
          res.json({message:"UnSuccessful"});
         }

}
exports.addReqCategory = async (req, res) => {
  const { title, description } = req.body;
  const sp_id=req.user.id;
    
  
  try {
    // Insert a new category into the database using raw SQL query
    if (title && sp_id) {
      const insertQuery = `
        INSERT INTO RequestCategories (sp_id, title, description)
        VALUES (${sp_id}, '${title}', '${description}')
      `;
      await sequelize.query(insertQuery);
    }


    res.json({ message: 'Category added successfully' });
  } catch (error) {
    console.error('Error handling category request:', error);
    res.status(500).json({ error: 'Failed to process category request.' });
  }
};

// Controller to fetch all categories with the service provider's name
exports.getReqCategories = async (req, res) => {
  try {
    // Fetch categories along with the service provider's name using SQL JOIN
    const fetchQuery = `
      SELECT rc.*, CONCAT(sp.firstName, ' ', sp.lastName) as fullname

      FROM RequestCategories rc
      JOIN ServiceProviders sp ON rc.sp_id = sp.sp_id;
    `;

    const [categories] = await sequelize.query(fetchQuery);
    
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories with service provider names:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

exports.removeReqCategories=async(req,res) =>
{
  
  try {
   const {id}= req.params;
   console.log(id);
    const query=`delete from RequestCategories where id=${id} `;
    await sequelize.query(query);
    res.json({message:"Successful"});
  }
  catch(error)
  {
    console.error('Error delete category',error);

  }
}


exports.getPayments = async (req, res) => {
  try {
    // Fetch categories along with the service provider's name using SQL JOIN
    const fetchQuery = `
      SELECT p.*, CONCAT(sp.firstName, ' ', sp.lastName) as fullname

      FROM Payments p
      JOIN ServiceProviders sp ON p.sp_id = sp.sp_id
      where p.status='Pending' and p.proof_of_payment is not null
    `;

    const [payments] = await sequelize.query(fetchQuery);
    
    res.status(200).json(payments);
  } catch (error) {
    console.error('Error fetching categories with service provider names:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
};






exports.updateCategoryStatus= async (req, res) => {
  const{status}=req.body
  const {category_id}= req.params;
  try {
     const query=`update Categories set status='${status}' where category_id=${category_id}`;
     await sequelize.query(query);
   
     res.json({message:"Successful"});
   
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
};




exports.updateServiceStatus= async (req, res) => {
  const{status}=req.body
  const {service_id}= req.params;
  try {
     const query=`update Services set status='${status}' where service_id=${service_id}`;
     await sequelize.query(query);
   
     res.json({message:"Successful"});
   
  } catch (error) {
    console.error('Error updating services:', error);
    res.status(500).json({ error: 'Failed to fetch payments' });
  }
};