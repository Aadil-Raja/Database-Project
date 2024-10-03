const sequelize = require('../config/db');

exports.createCitiesTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS Cities (
      city_id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE
    );
  `;
  await sequelize.query(query);
};


