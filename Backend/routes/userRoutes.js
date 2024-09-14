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

module.exports = router;
