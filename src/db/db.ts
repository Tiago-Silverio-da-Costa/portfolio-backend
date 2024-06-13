import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
    user: process.env.SUPABASE_SERVICE_ROLE,
    password: process.env.SUPABASE_SERVICE_PASSWORD,
    host: process.env.SUPABASE_SERVICE_HOST,
    port: 6543,
    database: "postgres",
})

export default pool;
