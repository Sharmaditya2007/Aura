const multer = require('multer');

const storage = multer.memoryStorage();

const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];

const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new Error('Only JPG, JPEG, PNG, and WebP images are permitted');
    error.statusCode = 400;
    error.errorType = 'Bad Request';
    cb(error, false);
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5 MB max
  },
  fileFilter
});

function handleUpload(req, res, next) {
  const uploadSingle = upload.single('profilePicture');
  uploadSingle(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          status: 400,
          error: 'Bad Request',
          message: 'File size exceeds maximum permitted limit of 5 MB',
          timestamp: new Date().toISOString()
        });
      }
      return res.status(400).json({
        success: false,
        status: 400,
        error: 'Bad Request',
        message: err.message,
        timestamp: new Date().toISOString()
      });
    } else if (err) {
      return res.status(err.statusCode || 400).json({
        success: false,
        status: err.statusCode || 400,
        error: err.errorType || 'Bad Request',
        message: err.message || 'File upload failed',
        timestamp: new Date().toISOString()
      });
    }
    next();
  });
}

module.exports = {
  upload,
  handleUpload
};

