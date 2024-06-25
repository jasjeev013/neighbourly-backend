const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dbo1goy2k',
  api_key: '196314761784852',
  api_secret: 'h3Pwr_m_9vIH2nKgMMn3atnnFww'
});

module.exports = cloudinary;
