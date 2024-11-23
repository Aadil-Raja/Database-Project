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
        { name: 'Leak Repair', description: 'Fix leaks in pipes, faucets, and fixtures', image: 'leak-repair.jpg' },
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
      name: 'Carpentry and Woodwork', 
      description: 'Custom carpentry and woodwork services',
      services: [
        { name: 'Custom Furniture Making', description: 'Build custom furniture pieces', image: 'custom-furniture-making.jpg' },
        { name: 'Cabinet Installation', description: 'Install or repair kitchen and bathroom cabinets', image: 'cabinet-installation.jpg' },
        { name: 'Door and Window Installation', description: 'Install and repair doors and windows', image: 'door-window-installation.jpg' },
        { name: 'Deck Construction', description: 'Build and repair outdoor decks and patios', image: 'deck-construction.jpg' },
        { name: 'Flooring Installation', description: 'Install hardwood, laminate, or vinyl flooring', image: 'flooring-installation.jpg' }
      ]
    },
    { 
      name: 'HVAC Services', 
      description: 'Heating, ventilation, and air conditioning services',
      services: [
        { name: 'Air Conditioner Installation', description: 'Install and service AC units', image: 'ac-installation.jpg' },
        { name: 'Furnace Repair', description: 'Install and repair heating furnaces', image: 'furnace-repair.jpg' },
        { name: 'Ventilation Maintenance', description: 'Clean and maintain ventilation systems', image: 'ventilation-maintenance.jpg' },
        { name: 'Thermostat Installation', description: 'Install and program thermostats', image: 'thermostat-installation.jpg' },
        { name: 'Duct Cleaning', description: 'Clean air ducts and seal leaks', image: 'duct-cleaning.jpg' }
      ]
    },
    { 
      name: 'Painting and Decorating', 
      description: 'Professional painting and decorating services',
      services: [
        { name: 'Interior Painting', description: 'Paint walls, ceilings, and interiors', image: 'interior-painting.jpg' },
        { name: 'Exterior Painting', description: 'Paint building exteriors, fences, and decks', image: 'exterior-painting.jpg' },
        { name: 'Wallpaper Installation', description: 'Apply or remove wallpaper', image: 'wallpaper-installation.jpg' },
        { name: 'Drywall Repair', description: 'Fix holes and cracks in drywall', image: 'drywall-repair.jpg' },
        { name: 'Decorative Finishes', description: 'Faux finishes and artistic painting', image: 'decorative-finishes.jpg' }
      ]
    },
    { 
      name: 'Landscaping and Gardening', 
      description: 'Complete landscaping and gardening solutions',
      services: [
        { name: 'Lawn Mowing', description: 'Regular grass cutting and lawn care', image: 'lawn-mowing.jpg' },
        { name: 'Garden Design', description: 'Design gardens and plant flowers', image: 'garden-design.jpg' },
        { name: 'Tree Trimming', description: 'Prune or remove trees and shrubs', image: 'tree-trimming.jpg' },
        { name: 'Irrigation Installation', description: 'Install and repair sprinkler systems', image: 'irrigation-installation.jpg' },
        { name: 'Hardscaping', description: 'Build patios, walkways, and walls', image: 'hardscaping.jpg' }
      ]
    },
    { 
      name: 'Solar Services', 
      description: 'Solar panel installation and maintenance services',
      services: [
        { name: 'Solar Panel Installation', description: 'Install solar panels on rooftops', image: 'solar-panel-installation.jpg' },
        { name: 'Solar Panel Maintenance', description: 'Routine maintenance of solar systems', image: 'solar-panel-maintenance.jpg' },
        { name: 'Solar Cleaning', description: 'Clean solar panels for optimal efficiency', image: 'solar-cleaning.jpg' },
        { name: 'Energy Audits', description: 'Assess energy needs and savings', image: 'energy-audits.jpg' },
        { name: 'Battery Storage Solutions', description: 'Install solar battery storage systems', image: 'battery-storage-solutions.jpg' }
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
