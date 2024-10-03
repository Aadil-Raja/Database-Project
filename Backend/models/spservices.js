const sequelize = require('../config/db');

exports.createServiceProviderServicesTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS ServiceProviderServices (
      sp_service_id INT AUTO_INCREMENT PRIMARY KEY,
      service_provider_id INT NOT NULL,
      service_id INT NOT NULL,
      availability_status BOOLEAN DEFAULT TRUE,
      FOREIGN KEY (service_provider_id) REFERENCES ServiceProviders(sp_id)
        ON DELETE CASCADE,
      FOREIGN KEY (service_id) REFERENCES Services(service_id)
        ON DELETE CASCADE
    );
  `;
  await sequelize.query(query);
};


