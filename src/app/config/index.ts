import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const config = {
  mongo_db_url: process.env.MONGO_DB_URL,
  port: process.env.PORT,
  serverUrl: process.env.BASE_URL,
  clientUrl: process.env.CLIENT_URL
  jwt_secret: process.env.JWT_SECRET, 
  node_env: process.env.NODE_ENV || 'development' 
};

export default config;
