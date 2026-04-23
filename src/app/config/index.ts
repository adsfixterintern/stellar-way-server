import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const config = {
  mongo_db_url: process.env.MONGO_DB_URL,
  port: process.env.PORT || 5000,
 serverUrl: process.env.serverUrl || 'https://stellar-way-server-production.up.railway.app',
  clientUrl: process.env.clientUrl || 'https://stellar-way.vercel.app',
  jwt_secret: process.env.JWT_SECRET,
  node_env: process.env.NODE_ENV || "development",
  store_id: process.env.STORE_ID,
  store_passwd: process.env.STORE_PASSWORD,
  is_live: process.env.IS_LIVE === "true",
  stripe_secret_key: process.env.STRIPE_SECRET_KEY,
  stripe_publishable_key: process.env.STRIPE_PUBLISHABLE_KEY,
};

export default config;
