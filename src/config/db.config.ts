import dotenv from 'dotenv';
dotenv.config();

export default {
    DB: process.env.POSTGRES_DATABASE as string,
    USER: process.env.POSTGRES_USER as string,
    PASSWORD: process.env.POSTGRES_PASSWORD as string,
    HOST: process.env.POSTGRES_HOST as string,
    dialect: 'postgres', 
    URL: process.env.POSTGRES_URL as string,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }

}