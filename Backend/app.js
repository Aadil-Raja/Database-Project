const express = require('express');
const sequelize = require('./config/db');
const cors = require('cors');
require('dotenv').config()
const initializeCities = require('./seeds/initializeCities');
const initializeCategoriesAndServices=require('./seeds/initializeCategoriesAndServices');
const Client = require('./models/client');
const ServiceProvider = require('./models/Sp');
const Category= require('./models/category');
const Services =require('./models/service');
const ServiceProviderServices=require('./models/spservices');
const cities=require('./models/city');
const ServiceRequest=require('./models/serviceRequest');
const RequestCategoryService=require('./models/RequestsCategory');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/', require('./routes/userRoutes'));


const initializeApp = async () => {
    try {
      await sequelize.sync({sync:true }); // Ensures the database syncs
      await initializeCities();              // Populate city table
      await initializeCategoriesAndServices();
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
