import * as dotenv from 'dotenv';
import * as sequelize from 'sequelize';

const mustExist = <T>(value: T | undefined, name: string): T => {
    if (!value) {
      console.error(`Missing Config: ${name} !!!`);
      process.exit(1);
    }
    return value;
  };
  
  dotenv.config();

  export const port = mustExist(parseInt(process.env.PORT!) as number, "PORT"),
  /**
   * Application mode (Set the environment to 'development' by default)
   */
  environment = mustExist(process.env.ENVIRONMENT, "ENVIRONMENT"),
  frontEndURL = mustExist(process.env.FRONT_END_URL, "FRONT_END_URL"),
  /**
   * Database Connection
   */
  db = {
    username: mustExist(process.env.DB_USER! as string, "DB_USER"),
    password: mustExist(process.env.DB_PASSWORD! as string, "DB_PASSWORD"),
    name: mustExist(process.env.DB_NAME! as string, "DB_NAME"),
    host: mustExist(process.env.DB_HOST! as string, "DB_HOST"),
    dialect: mustExist(process.env.DB_DIALECT! as sequelize.Dialect, 'DB_DIALECT'),
    port: mustExist(parseInt(process.env.DB_PORT!) as number, "DB_PORT"),
    logging: false,
    timezone: 'utc' as string,
  },
  supabase ={
    publicAnonKey: mustExist(process.env.SUPABASE_PUBLIC_ANON_Key! as string, "SUPABASE_PUBLIC_ANON_Key"),
    url: mustExist(process.env.SUPABASE_URL! as string, "SUPABASE_URL"),
    serviceRole:mustExist(process.env.SUPABASE_SERVICE_ROLE! as string, "SUPABASE_SERVICE_ROLE"),
  },
  stripe = {
    secretKey: mustExist(process.env.STRIPE_SECRET_KEY! as string, "STRIPE_SECRET_KEY"),
    webhookSecret: mustExist(process.env.STRIPE_WEBHOOK_SECRET! as string, "STRIPE_WEBHOOK_SECRET")
  },
  corsWhitelist = ["http://localhost:5173"] as string[]

export * from "./instance";