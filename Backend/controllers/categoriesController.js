
const sequelize = require('../config/db');
const Category = require('../models/category'); 

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getACategory =async(req,res)=>{
  try{
    const { categoryId } = req.params;
   const query= `select * from categories where category_id=${categoryId}`;

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