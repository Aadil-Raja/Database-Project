const multer = require('multer');
const path = require('path');

// Allowed file extensions
const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif','.pdf'];

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folderPath;

    if (req.body.folder === 'profile') {
      folderPath = path.join(__dirname, '../public/profile');
    } else {
      // Determine folder path based on the route or some flag in the request
      if (req.body.folder === 'payments') {
        folderPath = path.join(__dirname, '../public/payments'); // Folder for payments
      } else if (req.body.folder === 'RequestImages') {
        folderPath = path.join(__dirname, '../public/RequestImages');
      } else {
        folderPath = path.join(__dirname, '../public/images'); // Default folder for services
      }
    }

    cb(null, folderPath); // Pass the folder path to multer's callback
  },
  filename: function (req, file, cb) {
    let fileName;
    const extension = path.extname(file.originalname).toLowerCase(); // Get file extension

    if (!allowedExtensions.includes(extension)) {
      console.log('Invalid file extension:', extension);
      // Use a default filename for invalid extensions
      fileName = `invalid-file-${Date.now()}.txt`; // Or any fallback logic
    } else {
      // If this is for profile
      if (req.body.folder === 'profile') {
        const { email } = req.body;
        fileName = `${email}.jpg`; // Save as email.jpg
      } else if (req.body.folder === 'payments') {
        const { payment_id, sp_id } = req.body;
        fileName = `${payment_id}_${sp_id}${extension}`; // Save as 'payment_id_sp_id.extension'
      } else if (req.body.folder === 'RequestImages') {
        const reqid = req.body.insertID || 'defaultID';
        fileName = `${reqid}.jpg`; // Save as 'insertID.extension'
      } else {
        // Default naming convention for services
        const Name = req.body.name || 'default-name'; // Fallback to 'default-name' if name is not provided
        fileName = `${Name.toLowerCase().replace(/ /g, '-')}.png`; // Save as 'name.extension'
      }
    }

    cb(null, fileName); // Pass the file name to multer's callback
  },
});

// Initialize multer with the dynamic storage configuration
const upload = multer({ storage: storage });

module.exports = upload;
