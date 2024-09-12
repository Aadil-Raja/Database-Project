const express = require('express');
const router = express.Router();

// Import controllers
const clientController = require('../controllers/clientController');
const spController = require('../controllers/spController');
const cityController = require('../controllers/cityController');
const loginController = require('../controllers/loginController.js')

// Client routes
router.post('/register/client', clientController.createClient);
router.post('/login',loginController.login );

// Service Provider routes
router.post('/register/sp', spController.createSp);
router.post('/login',loginController.login );

// City routes
router.get('/cities', cityController.getCities);

module.exports = router;
