const sequelize = require('../config/db'); 
const Category = require('../models/category'); 
const Service = require('../models/service'); 

const initializeCategoriesAndServices = async () => {
  const categories = [
    { 
      name: 'Plumbing', 
      description: 'Plumbing services for household and commercial needs',
      services: [
        { name: 'Pipe Repair', description: 'Fix broken or leaking pipes' },
        { name: 'Drain Cleaning', description: 'Clean blocked drains' },
        { name: 'Leak Detection', description: 'Detect leaks in water systems' },
        { name: 'Faucet Installation', description: 'Install new faucets' },
        { name: 'Water Heater Repair', description: 'Repair malfunctioning water heaters' }
      ]
    },
    { 
      name: 'Electrical Work', 
      description: 'All kinds of electrical services', 
      services: [
        { name: 'Wiring Installation', description: 'Install electrical wiring' },
        { name: 'Electrical Panel Upgrade', description: 'Upgrade electrical panels' },
        { name: 'Light Fixture Installation', description: 'Install light fixtures' },
        { name: 'Outlet Repair', description: 'Repair electrical outlets' },
        { name: 'Circuit Breaker Replacement', description: 'Replace faulty circuit breakers' }
      ]
    },
    { 
      name: 'Home Cleaning', 
      description: 'Professional cleaning services for homes',
      services: [
        { name: 'Kitchen Cleaning', description: 'Clean kitchen areas' },
        { name: 'Bathroom Cleaning', description: 'Clean bathroom areas' },
        { name: 'Carpet Cleaning', description: 'Clean and shampoo carpets' },
        { name: 'Window Washing', description: 'Wash windows' },
        { name: 'Deep House Cleaning', description: 'Thorough cleaning of the entire house' }
      ]
    },
   
  ];

  for (const category of categories) {
 
    const insertCategoryQuery = `
      INSERT IGNORE INTO Categories (name, description)
      VALUES ('${category.name}', '${category.description}');
    `;
    
    await sequelize.query(insertCategoryQuery);

    const [results] = await sequelize.query(`SELECT category_id FROM Categories WHERE name = '${category.name}';`);
    const category_id = results[0].category_id;

   
    for (const service of category.services) {
      const insertServiceQuery = `
        INSERT IGNORE INTO Services (name, category_id, description)
        VALUES ('${service.name}', ${category_id}, '${service.description}');
      `;
      
      await sequelize.query(insertServiceQuery);
    }
  }

  console.log('Categories and services initialized successfully');
};

module.exports = initializeCategoriesAndServices;