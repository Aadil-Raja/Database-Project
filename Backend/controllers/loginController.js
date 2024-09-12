

const Client = require("../models/client");
const Sp = require('../models/Sp');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Check ServiceProvider
      const spUser = await Sp.findOne({ where: { email } });
      if (spUser) {
        const passwordMatch = await bcrypt.compare(password, spUser.password);
        if (passwordMatch) {
            console.log(`Login successful for ServiceProvider: ${email}`);
          const token = jwt.sign({ id: spUser.id, email: spUser.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
          return res.json({ message: "exist", token, role: "service_provider" });
        }
      }
  
      // Check Client
      const clientUser = await Client.findOne({ where: { email } });
      if (clientUser) {
        const passwordMatch = await bcrypt.compare(password, clientUser.password);
        if (passwordMatch) {
            
            console.log(`Login successful for Client: ${email}`);
          const token = jwt.sign({ id: clientUser.id, email: clientUser.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
          return res.json({ message: "exist", token, role: "client" });
        }
      }
  
      return res.json("notexist");
    } catch (e) {
      console.error('Login error:', e.message);
      res.status(500).json("fail");
    }
  };
  