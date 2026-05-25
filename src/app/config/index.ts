import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const config = {
  mongo_db_url: process.env.MONGO_DB_URL,
  port: process.env.PORT || 5000,
 serverUrl: process.env.serverUrl || 'https://stellar-way-server-production.up.railway.app',
  clientUrl: process.env.clientUrl || 'https://stellar-way.vercel.app',
  jwt_secret: process.env.JWT_SECRET,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  node_env: process.env.NODE_ENV || "development",
  store_id: process.env.STORE_ID,
  store_passwd: process.env.STORE_PASSWORD,
  is_live: process.env.IS_LIVE === "true",
  stripe_secret_key: process.env.STRIPE_SECRET_KEY,
  stripe_publishable_key: process.env.STRIPE_PUBLISHABLE_KEY,
  email_user: process.env.EMAIL_USER,
  email_pass: process.env.EMAIL_PASS,
};

export default config;
