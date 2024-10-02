const sequelize = require('../config/db');

// Controller to add a new category and return all categories
exports.addReqCategory = async (req, res) => {
  const { title, description } = req.body;
  const sp_id=req.user.id;
    
  
  try {
    // Insert a new category into the database using raw SQL query
    if (title && sp_id) {
      const insertQuery = `
        INSERT INTO requestcategories (sp_id, title, description)
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

      FROM requestcategories rc
      JOIN serviceproviders sp ON rc.sp_id = sp.sp_id;
    `;

    const [categories] = await sequelize.query(fetchQuery);
    
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error fetching categories with service provider names:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};