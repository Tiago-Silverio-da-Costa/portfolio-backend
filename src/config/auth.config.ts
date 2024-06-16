import dotenv from 'dotenv';

dotenv.config();

export default {
    secret: process.env.JWT_SECRET as string,
    jwtExpiration: parseInt(process.env.JWT_EXPIRATION as string , 10) || 60,      // 1 min
    jwtRefreshExpiration: parseInt(process.env.JWT_REFRESH_EXPIRATION as string, 10) || 120 // 2 minutes 
}