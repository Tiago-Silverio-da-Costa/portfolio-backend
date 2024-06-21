import * as dotenv from 'dotenv';
dotenv.config();

export default {
    secret: process.env.JWT_SECRET as string,
    jwtExpiration: parseInt(process.env.JWT_EXPIRATION as string , 10) || 3600, // 1 hour
    jwtRefreshExpiration: parseInt(process.env.JWT_REFRESH_EXPIRATION as string, 10) || 86400, // 24 hours
}