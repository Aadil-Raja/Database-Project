const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const RequestCategory = sequelize.define('RequestCategory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true, // Unique identifier for each entry
  },
  sp_id: {
    type: DataTypes.INTEGER,
   
     references: {
      model: 'serviceproviders', // Name of the referenced table (use plural if your model is defined that way)
      key: 'sp_id',                 // Column in the referenced table
     },
     allowNull: true,
     onDelete: 'set null',          // Optional: Cascade delete
    onUpdate: 'CASCADE',          // Optional: Cascade updates
  },
  
  title: {
    type: DataTypes.STRING,
    allowNull: false, // Title of the category
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true, // Optional description of the category
  },
},);

module.exports = RequestCategory;