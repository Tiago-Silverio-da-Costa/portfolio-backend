import { Pool } from 'pg';

export const pool = new Pool({
    user: "postgres.fybjleupzmllbgmrbgvl",
    password: "JNXJUdXF4E5Auypn",
    host: "aws-0-us-east-1.pooler.supabase.com",
    port: 6543,
    database: "postgres",
})

export default pool;
