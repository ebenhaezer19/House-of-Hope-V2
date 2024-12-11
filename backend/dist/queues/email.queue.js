"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addEmailToQueue = addEmailToQueue;
const bull_1 = __importDefault(require("bull"));
const email_service_1 = require("../services/email.service");
const redis_config_1 = require("../config/redis.config");
const emailService = new email_service_1.EmailService();
let emailQueue = null;
try {
    emailQueue = new bull_1.default('email-queue', redis_config_1.redisConfig);
    emailQueue.on('error', (error) => {
        console.error('Queue error:', error);
        emailQueue = null;
    });
    emailQueue.on('failed', (job, error) => {
        console.error(`Email job ${job === null || job === void 0 ? void 0 : job.id} failed:`, error);
    });
    emailQueue.process(async (job) => {
        return processEmailJob(job.data);
    });
}
catch (error) {
    console.error('Failed to initialize email queue:', error);
}
async function processEmailJob(jobData) {
    const { type, data } = jobData;
    switch (type) {
        case 'welcome':
            await emailService.sendWelcomeEmail(data.email, data.name || '');
            break;
        case 'resetPassword':
            if (!data.resetToken)
                throw new Error('Reset token is required');
            await emailService.sendResetPasswordEmail(data.email, data.resetToken);
            break;
        case 'passwordChanged':
            await emailService.sendPasswordChangedEmail(data.email, data.name || '');
            break;
        default:
            throw new Error(`Unknown email type: ${type}`);
    }
}
async function addEmailToQueue(job) {
    if (!emailQueue) {
        throw new Error('Email queue not initialized');
    }
    try {
        await emailQueue.add(job, {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 1000
            }
        });
    }
    catch (error) {
        console.error('Failed to add job to queue:', error);
        throw error;
    }
}
process.on('SIGTERM', async () => {
    if (emailQueue) {
        await emailQueue.close();
    }
});
//# sourceMappingURL=email.queue.js.map