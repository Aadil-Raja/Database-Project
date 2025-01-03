
const sequelize =require('../config/db');

exports.getACity = async (req, res) => {
  try {
    const { city_id } = req.query; 
    

    const query = `SELECT name FROM Cities WHERE city_id=${city_id}`;
    const [result] = await sequelize.query(query);
    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.getCities = async (req, res) => {
  try {
    const query = `SELECT * FROM Cities`;
    const [cities] = await sequelize.query(query);

   
    res.json(cities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




