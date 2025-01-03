
const sequelize = require('../config/db'); // Assuming you're using sequelize for raw queries

exports.getCategories = async (req, res) => {
  try {
    const query = `SELECT * FROM Categories where status='active'`;
    const [categories] = await sequelize.query(query); // Using raw SQL query
    res.json(categories); // Sending the fetched categories in response
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const query = `SELECT * FROM Categories `;
    const [categories] = await sequelize.query(query); // Using raw SQL query
    res.json(categories); // Sending the fetched categories in response
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.AddaCategory = async( req,res ) => {
  try {
      const {name ,description} =req.body;
    
      const query = `INSERT INTO Categories(name,description)
                      values('${name}','${description}')`;
                      await sequelize.query(query);
                      res.json("Successful");
  }
  catch (error)
  {
    res.json({message:error.message});
  }
}
exports.getACategory =async(req,res)=>{
  try{
    const { categoryId } = req.params;
   const query= `select * from Categories where category_id=${categoryId}`;

   const[result]=await sequelize.query(query);
   if (result.length === 0) {
    return res.json({ message: "Category not found" });
  }
 
   res.json(result[0])

  }
  catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ message: "Internal server error" });
  }
}