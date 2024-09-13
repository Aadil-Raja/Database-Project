const {  DataTypes } = require('sequelize');

const sequelize =require("../config/db")

const Client = sequelize.define('Client', {
  client_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
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
  resetPasswordToken: {
    type: DataTypes.STRING,
    allowNull: true, // This field can be null until a password reset is requested
  },
  resetPasswordExpires: {
    type: DataTypes.DATE,
    allowNull: true, // This field can be null until a password reset is requested
  }
}, {
  timestamps: true, // Automatically create createdAt and updatedAt fields
});


module.exports=Client;