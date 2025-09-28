const multer = require('multer');
const cloudinary = require('../utilis/cloudinary');
// Require the module, and immediately call it with the multer instance
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Create the storage instance using the imported constructor
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: { // Use 'params' instead of root properties for options like folder and format
        folder: 'Online-Book-Store',
        allowed_formats: ['jpg', 'png', 'jpeg'],
        // You can add other Cloudinary upload options here
    },
});

const upload = multer({ storage: storage });
module.exports = upload;