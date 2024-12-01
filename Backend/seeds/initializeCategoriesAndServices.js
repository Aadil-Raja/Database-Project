// initializeCategoriesAndServices.js
const sequelize = require('../config/db');
const Category = require('../models/category');
const Service = require('../models/service');

const initializeCategoriesAndServices = async () => {
  console.log("Initializing categories and services with images...");

  const categories = [
    { 
      name: 'Plumbing Services', 
      description: 'Professional plumbing services for all your needs',
      services: [
        { name: 'Leak Repair', description: 'Fix leaks in pipes, faucets, and fixtures', image: 'pipe-repair.png' },
        { name: 'Pipe Installation', description: 'Install new pipes or replace old ones', image: 'pipe-installation.jpg' },
        { name: 'Drain Cleaning', description: 'Unclog and clean drains and sewage lines', image: 'drain-cleaning.jpg' },
        { name: 'Water Heater Services', description: 'Install and repair water heaters', image: 'water-heater-services.jpg' },
        { name: 'Sewer Line Services', description: 'Inspect and repair sewer lines', image: 'sewer-line-services.jpg' }
      ]
    },
    { 
      name: 'Electrical Services', 
      description: 'Expert electrical solutions for your home',
      services: [
        { name: 'Wiring Installation', description: 'Install new electrical wiring or update old systems', image: 'wiring-installation.jpg' },
        { name: 'Lighting Installation', description: 'Install indoor and outdoor lighting fixtures', image: 'lighting-installation.jpg' },
        { name: 'Circuit Breaker Repair', description: 'Maintain and replace circuit breakers and panels', image: 'circuit-breaker-repair.jpg' },
        { name: 'Outlet and Switch Installation', description: 'Install or repair electrical outlets and switches', image: 'outlet-switch-installation.jpg' },
        { name: 'Ceiling Fan Installation', description: 'Install ceiling fans and related fixtures', image: 'ceiling-fan-installation.jpg' }
      ]
    },
    { 
      name: 'Carpentry Services', 
      description: 'Custom carpentry and woodwork services',
      services: [
        { name: 'Furniture Assembly', description: 'Assemble furniture efficiently and professionally', image: 'furniture-assembly.jpg' },
        { name: 'Cabinet Installation', description: 'Design and install custom cabinets', image: 'cabinet-installation.jpg' },
        { name: 'Wood Repair', description: 'Repair broken wooden items and fixtures', image: 'wood-repair.jpg' },
        { name: 'Deck Building', description: 'Construct durable and stylish outdoor decks', image: 'deck-building.jpg' },
        { name: 'Custom Woodworking', description: 'Create custom wooden pieces for your space', image: 'custom-woodworking.jpg' }
      ]
    },
    { 
      name: 'Cleaning Services', 
      description: 'Reliable cleaning solutions for homes and offices',
      services: [
        { name: 'Residential Cleaning', description: 'Thorough cleaning of your home', image: 'residential-cleaning.jpg' },
        { name: 'Office Cleaning', description: 'Professional cleaning services for offices', image: 'office-cleaning.jpg' },
        { name: 'Carpet Cleaning', description: 'Deep clean and sanitize carpets', image: 'carpet-cleaning.jpg' },
        { name: 'Window Cleaning', description: 'Clean and polish windows to a shine', image: 'window-cleaning.jpg' },
        { name: 'Move-in/Move-out Cleaning', description: 'Comprehensive cleaning for moving', image: 'move-cleaning.jpg' }
      ]
    },
    { 
      name: 'Home Renovation Services', 
      description: 'Upgrade your living space with expert renovations',
      services: [
        { name: 'Bathroom Renovation', description: 'Modernize and improve bathrooms', image: 'bathroom-renovation.jpg' },
        { name: 'Kitchen Remodeling', description: 'Create functional and beautiful kitchens', image: 'kitchen-remodeling.jpg' },
        { name: 'Flooring Installation', description: 'Install or refinish floors', image: 'flooring-installation.jpg' },
        { name: 'Painting Services', description: 'Interior and exterior painting', image: 'painting-services.jpg' },
        { name: 'Room Additions', description: 'Expand your home with new rooms', image: 'room-additions.jpg' }
      ]
    },
    { 
      name: 'Automotive Services', 
      description: 'Expert services for your vehicle needs',
      services: [
        { name: 'Car Washing', description: 'Thorough cleaning for your car', image: 'car-washing.jpg' },
        { name: 'Oil Change', description: 'Regular oil changes for optimal performance', image: 'oil-change.jpg' },
        { name: 'Tire Replacement', description: 'Replace and align tires', image: 'tire-replacement.jpg' },
        { name: 'Brake Repair', description: 'Maintain and repair brake systems', image: 'brake-repair.jpg' },
        { name: 'Battery Replacement', description: 'Replace old car batteries', image: 'battery-replacement.jpg' }
      ]
    }
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
