const express = require('express');
const userController = require("../controllers/usercontroller")
const router = express.Router();


router.post("/register/client",userController.createClient);
router.post("/register/sp",userController.createSp);

module.exports=router;
