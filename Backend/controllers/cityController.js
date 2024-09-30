
const City = require('../models/city'); 

exports.getCities = async (req, res) => {
  try {
    const cities = await City.findAll();
    res.json(cities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getACity = async (req, res) => {
  try {
    const { city_id } = req.query; // Change to req.query for GET request
   // const query = `SELECT name FROM cities WHERE city_id = ${city_id}`;
    //const [result] = await sequelize.query(query);
    res.json('Karachi'); // Send the first result
  } catch (error) {
   
    res.json({ error: error.message });
  }
};



