
const City = require('../models/city'); 

exports.getCities = async (req, res) => {
  try {
    const cities = await City.findAll();
    res.json(cities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
