import dotenv from 'dotenv';
dotenv.config();

export default {
  DB: process.env.DATABASE,
  USER: process.env.SUPABASE_SERVICE_ROLE,
  PASSWORD: process.env.SUPABASE_SERVICE_PASSWORD,
  HOST: process.env.SUPABASE_SERVICE_HOST,
  dialect: 'postgres',
  autoLoadEntities: true,
  synchronize: true,
  port: 6543,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }

}