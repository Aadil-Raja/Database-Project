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

const verifyToken = require('../middleware/auth');
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

router.post('/service-provider/preferences',verifyToken,savePreferences.savePreferences);

router.get('/service-provider/profile',verifyToken,serviceProviderProfile.getProfile);

router.put('/service-provider/updateProfile',verifyToken,serviceProviderProfile.updateProfile);
router.get('/service-provider/services',verifyToken,serviceProviderProfile.getServices);
router.put('/service-provider/updateAvailability/:service_id',verifyToken,serviceProviderProfile.updateAvailability);
router.delete('/service-provider/removeService/:service_id',verifyToken,serviceProviderProfile.removeService);

router.get('/categories/:categoryId',categoryController.getACategory);

router.post('/servicerequestform',verifyToken,servicerequestform.addRequest);

router.get('/getRequests',servicerequestform.getallRequests);
router.get('/getClientName',clientController.getClient);
router.get('/getCityName',cityController.getACity);
router.get('/getServiceName',serviceController.getaServiceName);


router.post('/Add-Category',verifyToken, adminController.addReqCategory); 
// Route to fetch categories
router.get('/admin', adminController.getReqCategories);
router.post('/Addcategories', upload.single('categoryImg'), categoryController.AddaCategory);

router.post('/AddService',upload.single('serviceImg'),serviceController.AddaService);
router.post('/saveMessage', chatController.saveMessage); // Route to save messages
router.get('/getMessages', chatController.getMessages); 

router.post('/getPendingRequestofClient',servicerequestform.getPendingRequestofClient);
router.post('/addAcceptedRequest',servicerequestform.addAcceptedRequest);
router.post('/cancelServiceRequest',servicerequestform.cancelServiceRequest);
router.get('/getUserName',chatController.getUserName);
router.get('/verify-token', verifyToken, (req, res) => {
    // If the token is valid, return success
    res.json({ isValid: true });
  });

module.exports = router;
