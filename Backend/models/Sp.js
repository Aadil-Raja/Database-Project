const sequelize = require('../config/db');

exports.createServiceProviderTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS ServiceProviders (
      sp_id INT AUTO_INCREMENT PRIMARY KEY,
      firstName VARCHAR(255) NOT NULL,
      lastName VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      phone VARCHAR(255) NOT NULL,
      address VARCHAR(255) NOT NULL,
      city_id INT,
      gender ENUM('Male', 'Female', 'Other') NOT NULL,
      dob DATE NOT NULL,
      role ENUM('client', 'service_provider', 'both') DEFAULT 'service_provider',
      status ENUM('active', 'inactive', 'locked') DEFAULT 'active',
      first_time_login BOOLEAN DEFAULT TRUE,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (city_id) REFERENCES Cities(city_id) ON DELETE SET NULL ON UPDATE CASCADE
    );
  `;

  await sequelize.query(query);
};
