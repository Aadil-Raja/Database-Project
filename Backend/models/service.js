const sequelize = require('../config/db');

exports.createServicesTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS Services (
      service_id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL UNIQUE,
      category_id INT,
      description VARCHAR(255),
      image VARCHAR(255) NOT NULL,
      status ENUM('active', 'inactive') DEFAULT 'active',
      FOREIGN KEY (category_id) REFERENCES Categories(category_id) 
        ON DELETE cascade
     
    );
  `;
  await sequelize.query(query);
};

