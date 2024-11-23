const express = require('express');
const router = express.Router();

// Import controllers
const clientController = require('../controllers/clientController');
const spController = require('../controllers/spController');
const cityController = require('../controllers/cityController');
const loginController = require('../controllers/loginController.js')
const forgetPasswordController=require('../controllers/forgotPasswordController.js');
const categoryController =require('../controllers/categoriesController.js');
const serviceController = require('../controllers/serviceController');
const savePreferences =require('../controllers/Spservices.js')
const resetPasswordController=require('../controllers/resetPasswordController.js');
const serviceProviderProfile=require('../controllers/spProfileController.js');
const servicerequestform=require('../controllers/serviceRequestController.js');
const adminController =require('../controllers/adminController.js');
const upload = require('../middleware/multer.js');
const chatController=require('../controllers/chatController.js');
const ChatHeads=require('../controllers/chatHeadController.js');
const Biling=require('../controllers/BillingController.js');

const verifyTokenAndRole = require('../middleware/auth');
const { verify } = require('crypto');
// Client routes

router.post('/register/client', clientController.createClient);
router.post('/login',loginController.login );

// Service Provider routes
router.post('/register/sp', spController.createSp);
router.post('/login',loginController.login );

// City routes
router.get('/cities', cityController.getCities);

router.post('/forgotpassword',forgetPasswordController.forgotPassword);


router.post('/resetpassword',resetPasswordController.resetpassword);

router.get ('/categories',categoryController.getCategories);
router.get('/services/:categoryId', serviceController.getServicesByCategory);

router.post('/service-provider/preferences',verifyTokenAndRole('serviceproviders'),savePreferences.savePreferences);

router.get('/service-provider/profile',verifyTokenAndRole('serviceproviders'),serviceProviderProfile.getProfile);

router.put('/service-provider/updateProfile',verifyTokenAndRole('serviceproviders'),upload.single('profileImage'),serviceProviderProfile.updateProfile);
router.get('/getEmail',serviceProviderProfile.getEmail);

router.get('/service-provider/services',verifyTokenAndRole('serviceproviders'),serviceProviderProfile.getServices);
router.put('/service-provider/updateAvailability/:service_id',verifyTokenAndRole('serviceproviders'),serviceProviderProfile.updateAvailability);
router.delete('/service-provider/removeService/:service_id',verifyTokenAndRole('serviceproviders'),serviceProviderProfile.removeService);

router.get('/categories/:categoryId',categoryController.getACategory);

router.post('/servicerequestform',verifyTokenAndRole('clients'),servicerequestform.addRequest);

router.get('/getRequests/:sp_id',servicerequestform.getallRequests);
router.get('/getClientName',clientController.getClient);
router.get('/getCityName',cityController.getACity);
router.get('/getServiceName',serviceController.getaServiceName);


router.post('/Add-Category',verifyTokenAndRole('serviceproviders'), adminController.addReqCategory); 
// Route to fetch categories
router.get('/admin', adminController.getReqCategories);
router.post('/Addcategories', upload.single('categoryImg'), categoryController.AddaCategory);

router.post('/AddService',upload.single('serviceImg'),serviceController.AddaService);
router.post('/saveMessage', chatController.saveMessage); // Route to save messages

router.get('/getMessages', chatController.getMessages); 

router.post('/saveRequestMessage',chatController.saveRequestMessage);
router.put('/updateRequestMessage', chatController.updateRequestMessage);

router.post('/getPendingRequestofClient',servicerequestform.getPendingRequestofClient);
router.post('/addAcceptedRequest',servicerequestform.addAcceptedRequest);
router.post('/cancelServiceRequest',servicerequestform.cancelServiceRequest);
router.get('/getUserName',chatController.getUserName);

router.post('/createORupdateChatHead',ChatHeads.createOrUpdateChatHead);
router.get('/getChatHeads',ChatHeads.getChatHeadsForUser);

router.delete('/removeReqCategories/:id',adminController.removeReqCategories);
router.get('/getPendingPayments',adminController.getPayments);
router.get('/client/orders/:client_id',clientController.getOrders);
router.get('/sp/orders/:sp_id',spController.getOrders);
router.put('/client/orders/:orderId',clientController.updateOrder);
router.post('/client/feedback',clientController.addfeedback);

router.get('/sp/getprofile/:sp_id',Biling.getProfile);
router.get('/sp/invoices/:sp_id',Biling.getInvoices);
router.get('/sp/invoiceDetails/:payment_id',Biling.getInvoiceDetails);
router.put('/sp/invoice/payment', upload.single('proofOfPayment'), Biling.uploadProofOfPayment);


router.put('/updatePaymentStatus/:id',Biling.updatePaymentStatus);

router.get('/verify-client', verifyTokenAndRole('clients'), (req, res) => {
  res.status(200).json({ message: 'Client verified' });
});

// Endpoint to verify service provider access
router.get('/verify-serviceprovider', verifyTokenAndRole('serviceproviders'), (req, res) => {
  res.status(200).json({ message: 'Service Provider verified' });
});

router.post('/LoginAdmin',adminController.login);
router.get('/verify-token', verifyTokenAndRole, (req, res) => {
    // If the token is valid, return success
    res.json({ isValid: true });
  });

module.exports = router;
