"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const errorMiddleware = (err, req, res, next) => {
    console.error(err.stack);
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
exports.errorMiddleware = errorMiddleware;
