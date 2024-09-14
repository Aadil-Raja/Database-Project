const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Service = sequelize.define('Service', {
  service_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  category_id : {
    type: DataTypes.INTEGER,
    references : {
       model : 'Categories',
       key : 'category_id',
    },
    onDelete : 'SET NULL',
    onUpdate : 'CASCADE',
    allowNUll :true,
  },
  description : {
    type :DataTypes.STRING,
    allowNull: true
  },
  status : {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active',
  }
});

module.exports = Service;
