const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ServiceRequest = sequelize.define('ServiceRequest', {
  request_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  service_id: {
    type: DataTypes.INTEGER,
    references: {
        model: 'Services',
        key: 'service_id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
      allowNull: true,
 
  },
  description : {
    type :DataTypes.STRING,
    allowNull: false
  },
  address: {
    type :DataTypes.STRING,
    allowNull: false
  },
  
   city_id : {
    type : DataTypes.INTEGER,
    references: {
        model: 'Cities', // Name of the table, not the model
        key: 'city_id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
      allowNull: true, 
   
   },
   client_id : {
    type :DataTypes.INTEGER,
    references: {
        model: 'Clients', // Name of the table, not the model
        key: 'client_id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
      allowNull: true, 
   

   },
   sp_id : {
    type :DataTypes.INTEGER,
    references: {
        model: 'serviceproviders',
        key: 'sp_id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
      allowNull: true,
    
   },
   status: {
     type: DataTypes.ENUM('pending', 'accepted', 'completed', 'cancelled'),
     defaultValue: 'pending', // Set default to pending when a request is created
   },
   request_date: {
     type: DataTypes.DATE,
     defaultValue: DataTypes.NOW, // Automatically set the current date/time when request is made
   },
   completed_date: {
     type: DataTypes.DATE,
     allowNull: true, // Set to NULL initially, updated when service is completed
   },
   price: {
     type: DataTypes.DECIMAL(10, 2),
     allowNull: true,
   },
   

});

module.exports = ServiceRequest;
