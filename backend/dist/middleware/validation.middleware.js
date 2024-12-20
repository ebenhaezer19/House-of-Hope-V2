"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const validate = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync(req.body);
            next();
        }
        catch (error) {
            res.status(400).json({
                message: 'Validation error',
                errors: error.errors
            });
        }
    };
};
exports.validate = validate;
//# sourceMappingURL=validation.middleware.js.map