const sequelize = require('../config/db');

exports.createServiceProviderServicesTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS ServiceProviderServices (
      service_provider_id INT NOT NULL,
      service_id INT NOT NULL,
      availability_status BOOLEAN DEFAULT TRUE,
      primary key(service_provider_id,service_id),
      FOREIGN KEY (service_provider_id) REFERENCES ServiceProviders(sp_id)
        ON DELETE CASCADE,
      FOREIGN KEY (service_id) REFERENCES Services(service_id)
        ON DELETE CASCADE
    );
  `;
  await sequelize.query(query);
};


