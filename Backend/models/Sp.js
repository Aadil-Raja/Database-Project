const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');


const ServiceProvider = sequelize.define('ServiceProvider', {
  sp_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
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
    allowNull: false, // Add address for service provider
  },
  city_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Cities', // Name of the table, not the model
      key: 'city_id',
    },
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    allowNull: true, // It can be set to null if the referenced city is deleted
  },
  gender: {
    type: DataTypes.ENUM('Male', 'Female', 'Other'),
    allowNull: false, // Add gender field
  },
  dob: {
    type: DataTypes.DATEONLY,
    allowNull: false, // Date of birth for the service provider
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
  resetPasswordToken: {
    type: DataTypes.STRING,
    allowNull: true, // This field can be null until a password reset is requested
  },
  resetPasswordExpires: {
    type: DataTypes.DATE,
    allowNull: true, // This field can be null until a password reset is requested
  },
}, {
  timestamps: true, // Automatically create createdAt and updatedAt fields
});

module.exports = ServiceProvider;
