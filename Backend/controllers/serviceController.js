
const sequelize = require('../config/db'); // Assuming you're using sequelize for raw queries

exports.getServicesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Raw SQL query to fetch services by category_id
    const query = `SELECT * FROM services WHERE category_id = ${categoryId}`;
    const [services] = await sequelize.query(query); // Executing the raw SQL query

    res.json(services); // Returning the fetched services
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ message: 'Server error fetching services' });
  }
};

exports.AddaService = async( req,res ) => {
  try {
      const {name ,description,category_id} =req.body;
    
      const query = `INSERT INTO services(name,description,category_id,image)
                      values('${name}','${description}',${category_id},'${name}')`;
                      await sequelize.query(query);
                      res.json("Successful");
  }
  catch (error)
  {
    res.status(500).json({message:error.message});
  }
}
exports.getaServiceName = async (req, res) => {
  try {
    const { service_id } = req.query; // Change to req.query for GET request
    const query = `SELECT name FROM services WHERE service_id = ${service_id}`;
    const [result] = await sequelize.query(query);
    res.json(result[0] || { message: 'Service not found' })
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


