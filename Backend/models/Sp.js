const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ServiceProvider = sequelize.define('ServiceProvider', {
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Ensure emails are unique
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tips: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  terms: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});

module.exports =  ServiceProvider ;
