import dotenv from 'dotenv';
// import { Pool } from 'pg';

dotenv.config();

// export const pool = new Pool({
//     user: process.env.SUPABASE_SERVICE_ROLE as string,
//     password: process.env.SUPABASE_SERVICE_PASSWORD as string,
//     host: process.env.SUPABASE_SERVICE_HOST as string,
//     port: 6543,
//     database: "postgres",
// })

export default {
    DB: process.env.DATABASE as string,
    USER: process.env.SUPABASE_SERVICE_ROLE as string,
    PASSWORD: process.env.SUPABASE_SERVICE_PASSWORD as string,
    HOST: process.env.SUPABASE_SERVICE_HOST as string,
    dialect: 'postgres', 
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }

}