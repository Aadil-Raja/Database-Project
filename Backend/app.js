const express = require('express');
const sequelize = require('./config/db');
const http = require('http');
const cors = require('cors');
require('dotenv').config()
const initializeCities = require('./seeds/initializeCities');
const initializeCategoriesAndServices=require('./seeds/initializeCategoriesAndServices');

const cities=require('./models/city');
const Client = require('./models/client');
const ServiceProvider = require('./models/Sp');
const Category= require('./models/category');
const Services =require('./models/service');
const ServiceProviderServices=require('./models/spservices');

const ServiceRequest=require('./models/serviceRequest');

const RequestCategoryService=require('./models/RequestsCategory');
const messsages =require('./models/message');
const ChatHeads=require('./models/ChatHead');
const app = express();
const PORT = process.env.PORT || 3000;

const {initSocket}=require('./utils/socket');
const server = http.createServer(app);
initSocket(server);

server.listen(3002, () => {
  console.log(`Chat Server running on port ${PORT}`);
});

app.use(cors());
app.use(express.json());
app.use('/', require('./routes/userRoutes'));
app.use('/images', express.static('public/images'));


const initializeApp = async () => {
    try {
      await sequelize.sync({force:true });
      cities.createCitiesTable();
      ServiceProvider.createServiceProviderTable();
      Client.createClientsTable(); 
      Category.createCategoriesTable();
      Services.createServicesTable();
      ServiceRequest.createServiceRequestsTable();
      ServiceProviderServices.createServiceProviderServicesTable();
      RequestCategoryService.createRequestCategoryTable();
      messsages.createMessageTable();
      ChatHeads.createChatHeadTable();
      // Ensures the database syncs
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
    console.log(`Server is running on portt ${PORT}`);
});
