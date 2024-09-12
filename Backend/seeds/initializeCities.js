const City = require('../models/city'); // Ensure your city model is imported

const initializeCities = async () => {
  const cities = [
    { name: 'Karachi' },
    { name: 'Lahore' },
    { name: 'Islamabad' },
    { name: 'Peshawar' },
    // Add more cities as required
  ];

  for (const city of cities) {
    await City.findOrCreate({
      where: { name: city.name }, // Avoid duplicates by checking the city name
    });
  }

  console.log('Cities initialized successfully');
};

module.exports = initializeCities;
