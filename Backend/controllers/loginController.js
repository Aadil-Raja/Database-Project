

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
            console.log(spUser.sp_id,spUser.email);
            const token = jwt.sign({ id: spUser.sp_id, email: spUser.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
            
            let first_time_login = null;
            if (spUser.first_time_login === true) {
                first_time_login = "First time login";
                
                // Update first_time_login to false in the database
                await Sp.update(
                  { first_time_login: false },
                  { where: { sp_id: spUser.sp_id } } // Correct syntax for where clause
              );
              
            }
          return res.json({ message: "exist", token, role: "servicesproviders" ,first_time_login});
        }
        else 
        {
          return res.json({ message: "Invalid password" });
        }
      }
  
      // Check Client
      const clientUser = await Client.findOne({ where: { email } });
      if (clientUser) {
        const passwordMatch = await bcrypt.compare(password, clientUser.password);
        if (passwordMatch) {
            
            console.log(`Login successful for Client: ${email}`);
          const token = jwt.sign({ id: clientUser.client_id, email: clientUser.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
          return res.json({ message: "exist", token, role: "clients" });
        }
        else 
        {
          return res.json({ message: "Invalid password" });
        }
      }
  
      return res.json("notexist");
    } catch (e) {
      console.error('Login error:', e.message);
      res.status(500).json("fail");
    }
  };
  