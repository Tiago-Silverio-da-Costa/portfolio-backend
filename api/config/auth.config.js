"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.default = {
    secret: process.env.JWT_SECRET,
    jwtExpiration: parseInt(process.env.JWT_EXPIRATION, 10) || 3600, // 1 hour
    jwtRefreshExpiration: parseInt(process.env.JWT_REFRESH_EXPIRATION, 10) || 86400, // 24 hours
};
