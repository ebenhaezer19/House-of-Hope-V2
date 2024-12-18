const multer = require('multer');

exports.errorMiddleware = (err, req, res, next) => {
    console.error(err.stack);

    // Handling Multer errors
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({
                success: false,
                message: 'Ukuran file terlalu besar. Maksimal 10MB'
            });
        }
        return res.status(400).json({
            success: false,
            message: 'Error saat upload file'
        });
    }

    // Default error
    const status = err.status || 500;
    const message = err.message || 'Terjadi kesalahan pada server';

    // Response
    res.status(status).json({
        success: false,
        message,
        errors: err.errors,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
}; 