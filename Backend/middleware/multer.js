// middlewares/uploadMiddleware.js
const multer = require('multer');
const path = require('path');

// Multer disk storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/images')); // Path to the public/images folder
  },
  filename: function (req, file, cb) {
    // Assuming the category name is being passed in the body as 'categoryName'
    const Name = req.body.name;  // 'name' must be passed from the frontend
    const extension = path.extname(file.originalname); // Get the file extension
    cb(null, `${Name.toLowerCase().replace(/ /g, '-')}${extension}`);  // Save as category-name.extension
  },
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

module.exports = upload;
