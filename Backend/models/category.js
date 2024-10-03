const sequelize = require('../config/db');

exports.createCategoriesTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS Categories (
      category_id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      description VARCHAR(255),
      status ENUM('active', 'inactive') DEFAULT 'active'
    );
  `;
  await sequelize.query(query);
};
