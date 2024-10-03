const sequelize = require('../config/db');

exports.createServiceRequestsTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS ServiceRequests (
      request_id INT AUTO_INCREMENT PRIMARY KEY,
      service_id INT,
      description VARCHAR(255) NOT NULL,
      address VARCHAR(255) NOT NULL,
      city_id INT,
      client_id INT,
      sp_id INT,
      status ENUM('pending', 'accepted', 'completed', 'cancelled') DEFAULT 'pending',
      request_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      completed_date DATETIME NULL,
      price DECIMAL(10, 2) NULL,
      FOREIGN KEY (service_id) REFERENCES Services(service_id) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE,
      FOREIGN KEY (city_id) REFERENCES Cities(city_id) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE,
      FOREIGN KEY (client_id) REFERENCES Clients(client_id) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE,
      FOREIGN KEY (sp_id) REFERENCES ServiceProviders(sp_id) 
        ON DELETE SET NULL 
        ON UPDATE CASCADE
    );
  `;
  await sequelize.query(query);
};

