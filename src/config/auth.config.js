"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = require("dotenv");
dotenv.config();
exports.default = {
    secret: process.env.JWT_SECRET,
    jwtExpiration: parseInt(process.env.JWT_EXPIRATION, 10) || 3600, // 1 hour
    jwtRefreshExpiration: parseInt(process.env.JWT_REFRESH_EXPIRATION, 10) || 86400, // 24 hours
};
