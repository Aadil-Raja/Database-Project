const express = require('express');
const sequelize = require('./config/db');
const cors = require('cors');
require('dotenv').config()
const initializeCities = require('./seeds/initializeCities');
const Client = require('./models/client');
const ServiceProvider = require('./models/Sp');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/', require('./routes/userRoutes'));

const initializeApp = async () => {
    try {
      await sequelize.sync({ alter: true }); // Ensures the database syncs
      await initializeCities();              // Populate city table
      console.log('Database & tables initialized!');
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  };
  
  // Call the initialization function
  initializeApp();
app.get("/",(req,res)=>{
    res.send("Server running");
})
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
