"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = require("dotenv");
dotenv.config();
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
