const multer = require('multer');
const { soilReportStorage } = require('../config/cloudinary');
const ApiError = require('../utils/ApiError');

/**
 * Configure Multer for soil report uploads to Cloudinary
 */
const soilFileUpload = multer({
  storage: soilReportStorage,
  limits: { 
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(ApiError.badRequest('Invalid file type. Only PDF, PNG, JPG, and JPEG are allowed.', 'INVALID_FILE_TYPE'), false);
    }
    cb(null, true);
  }
});

module.exports = {
  soilFileUpload
};
