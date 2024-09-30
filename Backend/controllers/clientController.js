// clientController.js
const Client = require("../models/client");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const sequelize = require('../config/db');

exports.createClient = async (req, res) => {
  try {
    const { name,email,password} = req.body;
    if (!name || !email || !password === undefined) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const checkEmailInSp = `SELECT * FROM ServiceProviders WHERE email = '${email}'`;
    const [spUser] = await sequelize.query(checkEmailInSp);

    // Check if the email already exists in the Clients table
    const checkEmailInClient = `SELECT * FROM Clients WHERE email = '${email}'`;
    const [clientUser] = await sequelize.query(checkEmailInClient);

    // If email exists in either table, return an error
    if (spUser.length > 0 || clientUser.length > 0) {
      return res.json({ message: "Email already exists" });
    }

    // SQL query to insert a new service provider
    const insertQuery = `
      INSERT INTO Clients 
      (name, email, password, createdAt, updatedAt)
      VALUES 
      ('${name}',  '${email}', '${hashedPassword}', NOW(), NOW());
    `;


    await sequelize.query(insertQuery);
  
    
    res.json({
      message: "User Created Successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getClient = async (req, res) => {
  try {
    const { client_id } = req.query; // Change to req.query for GET request
    const query = `SELECT name FROM clients WHERE client_id = ${client_id}`;
    const [result] = await sequelize.query(query);
    res.json(result[0]); // Send the first result
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


