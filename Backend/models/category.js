const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Category = sequelize.define('Category', {
  category_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
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

module.exports = Category;
