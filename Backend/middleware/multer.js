const multer = require('multer');
const path = require('path');

// Multer disk storage configuration with dynamic folder destination
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folderPath;
 
    if(req.body.folder ==='profile')
    {
      folderPath = path.join(__dirname, '../public/profile');
    }
    else{
    // Determine folder path based on the route or some flag in the request
    if (req.body.folder === 'payments') {
      folderPath = path.join(__dirname, '../public/payments'); // Folder for payments
    } else {
      folderPath = path.join(__dirname, '../public/images'); // Default folder for services
    }
  }

    cb(null, folderPath); // Pass the folder path to multer's callback
  },
  filename: function (req, file, cb) {
    let fileName;

    // If this is for payments, use the naming convention 'payment_id_sp_id'
    if(req.body.folder ==='profile')
    {
      const {email}=req.body;
      //const extension = path.extname(file.originalname); 
      fileName = `${email}.jpg`

    } 
    else{
    if (req.body.folder === 'payments') {
     
      const { payment_id, sp_id } = req.body;
      const extension = path.extname(file.originalname); // Get the file extension
      fileName = `${payment_id}_${sp_id}${extension}`;   // Save as 'payment_id_sp_id.extension'
    } else {
      
      // Default naming convention for services
      const Name = req.body.name;  // 'name' must be passed from the frontend
     // const extension = path.extname(file.originalname); // Get the file extension
      fileName = `${Name.toLowerCase().replace(/ /g, '-')}.png`;  // Save as 'category-name.extension'
    }
  }

    cb(null, fileName); // Pass the file name to multer's callback
  },
});

// Initialize multer with the dynamic storage configuration
const upload = multer({ storage: storage });

module.exports = upload;
