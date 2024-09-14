const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ServiceProviderServices = sequelize.define('ServiceProviderServices', {
    sp_service_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    service_provider_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'serviceproviders',
        key: 'sp_id',
      },
      onDelete: 'CASCADE',
      allowNull: false,
    },
    service_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'services',
        key: 'service_id',
      },
      onDelete: 'CASCADE',
      allowNull: false,
    },
    availability_status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true, // Default to available
    },
    
  });
  module.exports = ServiceProviderServices;