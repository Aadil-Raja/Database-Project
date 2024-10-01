
const Service = require('../models/service'); 

const sequelize =require('../config/db');
exports.getServicesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params; 

    
    const services = await Service.findAll({
      where: {
        category_id: categoryId,
      },
    });

    
    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ message: 'Server error fetching services' });
  }
};

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


