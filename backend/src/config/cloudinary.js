const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const config = require('./index');

/**
 * Cloudinary configuration using centralized state.
 * Optimized for secure and performant media management.
 */

cloudinary.config({
  cloud_name: config.cloudinary.name,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret
});

const soilReportStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'agrisense/soil-reports',
    allowed_formats: ['pdf', 'jpg', 'jpeg', 'png'],
    resource_type: 'auto'
  }
});

module.exports = { cloudinary, soilReportStorage };
