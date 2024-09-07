const express = require('express');
const userController = require("../controllers/usercontroller")
const router = express.Router();
const authenticateToken = require('../middleware/auth');
router.post("/login",userController.login);
router.post("/register/client",userController.createClient);
router.post("/register/sp",userController.createSp);


module.exports=router;
