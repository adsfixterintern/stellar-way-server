import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const config = {
  mongo_db_url: process.env.MONGO_DB_URL,
  port: process.env.PORT
};

export default config;