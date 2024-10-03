const sequelize = require('../config/db');

exports.createClientsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS Clients (
      client_id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      resetPasswordToken VARCHAR(255),
      resetPasswordExpires DATETIME,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
  `;
  await sequelize.query(query);
};

