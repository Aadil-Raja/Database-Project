const sequelize = require('../config/db'); // Ensure you have access to the Sequelize instance

const initializeCities = async () => {
  const cities = [
    'Karachi',
    'Lahore',
    'Islamabad',
    'Peshawar'
    // Add more cities as required
  ];

  for (const city of cities) {
    const insertCityQuery = `
      INSERT IGNORE INTO Cities (name) VALUES('${city}');
    `;
    await sequelize.query(insertCityQuery);
  }

  console.log('Cities initialized successfully');
};

module.exports = initializeCities;
