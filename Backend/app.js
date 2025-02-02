const express = require('express');
const sequelize = require('./config/db');
const http = require('http');
const cors = require('cors');
const cron = require('node-cron');
require('dotenv').config()
const initializeCities = require('./seeds/initializeCities');
const initializeCategoriesAndServices=require('./seeds/initializeCategoriesAndServices');

const cities=require('./models/city');
const Client = require('./models/client');
const ServiceProvider = require('./models/Sp');
const Category= require('./models/category');
const Services =require('./models/service');
const ServiceProviderServices=require('./models/spservices');
const resetpasswordlog=require('./models/resetpasswordlog');
const ServiceRequest=require('./models/serviceRequest');

const RequestCategoryService=require('./models/RequestsCategory');
const messsages =require('./models/message');
const RequestMessages=require('./models/requestmessage');
const ChatHeads=require('./models/ChatHead');
const feedback =require('./models/feedback');
const payment =require('./models/payment');
const deleteExpiredResetToken=require('./controllers/resetPasswordController')
const {generateMonthlyInvoices} = require('./controllers/BillingController');
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
app.use('/payments', express.static('public/payments'));
app.use('/profile', express.static('public/profile'));
app.use('/RequestImages', express.static('public/RequestImages'));

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
      ChatHeads.createChatHeadTable();
      messsages.createMessageTable();
      RequestMessages.createRequestMessageTable();
    
     feedback.createfeedbackTable();
     payment.createPaymentsTable();
      resetpasswordlog.createResetPasswordLog();
      generateMonthlyInvoices();
      deleteExpiredResetToken.deleteExpiredTokens();
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
  // cron.schedule('0 0 1 * *', () => {
  //   console.log('Running monthly invoice generation task...');
   
  // });
app.get("/",(req,res)=>{
    res.send("Server running");
})

// cron.schedule('0 0 1 * *', () => {
//   console.log('Running monthly invoice generation task...');
//   generateMonthlyInvoices();
// });

cron.schedule('*/15 * * * *  ', () => {
  console.log('Running task to delete expired tokens every 15 minute...');
  deleteExpiredResetToken.deleteExpiredTokens();
});

cron.schedule('0 0 1 * *', () => {
  console.log('Running monthly invoice generation task...');
  generateMonthlyInvoices();
});
app.listen(PORT, () => {
    console.log(`Server is running on portt ${PORT}`);
});
