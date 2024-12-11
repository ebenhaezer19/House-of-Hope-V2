"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisConfig = exports.isRedisAvailable = exports.redis = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
let redisClient = null;
const createRedisClient = () => {
    try {
        const client = new ioredis_1.default({
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379'),
            maxRetriesPerRequest: null,
            connectTimeout: 3000,
            retryStrategy(times) {
                if (times > 3) {
                    console.log('Redis connection failed, switching to direct email mode');
                    return null;
                }
                const delay = Math.min(times * 50, 2000);
                return delay;
            }
        });
        client.on('error', (error) => {
            console.error('Redis connection error:', error);
            redisClient = null;
        });
        client.on('connect', () => {
            console.log('Successfully connected to Redis');
            redisClient = client;
        });
        return client;
    }
    catch (error) {
        console.error('Failed to create Redis client:', error);
        return null;
    }
};
exports.redis = createRedisClient();
const isRedisAvailable = () => {
    return redisClient !== null && redisClient.status === 'ready';
};
exports.isRedisAvailable = isRedisAvailable;
exports.redisConfig = {
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        maxRetriesPerRequest: null,
        retryStrategy(times) {
            if (times > 3)
                return null;
            const delay = Math.min(times * 50, 2000);
            return delay;
        }
    }
};
//# sourceMappingURL=redis.config.js.map