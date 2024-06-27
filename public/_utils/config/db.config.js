"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.default = {
    DB: process.env.DATABASE,
    USER: process.env.SUPABASE_SERVICE_ROLE,
    PASSWORD: process.env.SUPABASE_SERVICE_PASSWORD,
    HOST: process.env.SUPABASE_SERVICE_HOST,
    dialect: 'postgres',
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};
