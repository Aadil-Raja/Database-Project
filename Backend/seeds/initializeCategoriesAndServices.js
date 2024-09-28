const sequelize = require('../config/db');
const Category = require('../models/category');
const Service = require('../models/service');

const initializeCategoriesAndServices = async () => {
  console.log("Initializing categories and services with images...");

  const categories = [
    { 
      name: 'Plumbing', 
      description: 'Plumbing services for household and commercial needs',
      services: [
        { name: 'Pipe Repair', description: 'Fix broken or leaking pipes', image: 'pipe-repair.jpg' },
        { name: 'Drain Cleaning', description: 'Clean blocked drains', image: 'drain-cleaning.jpg' },
        { name: 'Leak Detection', description: 'Detect leaks in water systems', image: 'leak-detection.jpg' },
        { name: 'Faucet Installation', description: 'Install new faucets', image: 'faucet-installation.jpg' },
        { name: 'Water Heater Repair', description: 'Repair malfunctioning water heaters', image: 'water-heater-repair.jpg' }
      ]
    },
    { 
      name: 'Electrical Work', 
      description: 'All kinds of electrical services',
      services: [
        { name: 'Wiring Installation', description: 'Install electrical wiring', image: 'wiring-installation.jpg' },
        { name: 'Electrical Panel Upgrade', description: 'Upgrade electrical panels', image: 'electrical-panel-upgrade.jpg' },
        { name: 'Light Fixture Installation', description: 'Install light fixtures', image: 'light-fixture-installation.jpg' },
        { name: 'Outlet Repair', description: 'Repair electrical outlets', image: 'outlet-repair.jpg' },
        { name: 'Circuit Breaker Replacement', description: 'Replace faulty circuit breakers', image: 'circuit-breaker-replacement.jpg' }
      ]
    },
    { 
      name: 'Home Cleaning', 
      description: 'Professional cleaning services for homes',
      services: [
        { name: 'Kitchen Cleaning', description: 'Clean kitchen areas', image: 'kitchen-cleaning.jpg' },
        { name: 'Bathroom Cleaning', description: 'Clean bathroom areas', image: 'bathroom-cleaning.jpg' },
        { name: 'Carpet Cleaning', description: 'Clean and shampoo carpets', image: 'carpet-cleaning.jpg' },
        { name: 'Window Washing', description: 'Wash windows', image: 'window-washing.jpg' },
        { name: 'Deep House Cleaning', description: 'Thorough cleaning of the entire house', image: 'deep-house-cleaning.jpg' }
      ]
    },
  ];

  for (const category of categories) {
    // Insert category with image
    const insertCategoryQuery = `
      INSERT IGNORE INTO Categories (name, description)
      VALUES ('${category.name}', '${category.description}');
    `;
    await sequelize.query(insertCategoryQuery);

    const [results] = await sequelize.query(`SELECT category_id FROM Categories WHERE name = '${category.name}';`);
    const category_id = results[0].category_id;

    // Insert services with image
    for (const service of category.services) {
      const insertServiceQuery = `
        INSERT IGNORE INTO Services (name, category_id, description, image)
        VALUES ('${service.name}', ${category_id}, '${service.description}', '${service.image}');
      `;
      await sequelize.query(insertServiceQuery);
    }
  }

  console.log('Categories and services with images initialized successfully');
};

module.exports = initializeCategoriesAndServices;
