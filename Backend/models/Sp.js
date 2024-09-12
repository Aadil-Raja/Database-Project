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
  phone: {
    type: DataTypes.STRING,
    allowNull: false, // Add phone number for contact
  },
  address: {
    type: DataTypes.STRING,
    allowNull: true, // Add address for service provider
  },
  city: {
    type: DataTypes.STRING,
    allowNull: true, // The city where the service provider is located
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'other'),
    allowNull: true, // Add gender field
  },
  dob: {
    type: DataTypes.DATEONLY,
    allowNull: true, // Date of birth for the service provider
  },
  role: {
    type: DataTypes.ENUM('client', 'service_provider', 'both'),
    defaultValue: 'service_provider', // The default role for this model
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'locked'),
    defaultValue: 'active', // Status of the service provider account
  },
  tips: {
    type: DataTypes.BOOLEAN,
    defaultValue: false, // Whether the provider has opted into receiving tips
  },
  terms: {
    type: DataTypes.BOOLEAN,
    allowNull: false, // Agree to terms and conditions
  },
}, {
  timestamps: true, // Automatically create createdAt and updatedAt fields
});

module.exports = ServiceProvider;
