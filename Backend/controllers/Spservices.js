const sequelize = require('../config/db'); // Import sequelize instance

exports.savePreferences = async (req, res) => {
  try {
    const { services } = req.body;
    const service_provider_id = req.user.id; 

    
    for (const service of services) {
      const checkQuery = `SELECT * FROM serviceproviderservices 
                          WHERE service_provider_id = ${service_provider_id} 
                          AND service_id = ${service.serviceId}`;

      const [existingService] = await sequelize.query(checkQuery);

      // If the service does not already exist, insert it
      if (existingService.length === 0) {
        const insertQuery = `
        INSERT INTO ServiceProviderServices (service_provider_id, service_id,  availability_status) 
        VALUES (${service_provider_id}, ${service.serviceId}, ${service.available});
      `;
      await sequelize.query(insertQuery);
      }
    }



    res.json({ message: 'Preferences updated successfully' });
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ message: 'Failed to update preferences' });
  }
};


