import z from "zod";
import { config as dotenv } from "dotenv";

// env config
dotenv();

// zod
const numeric = () =>
  z
    .string()
    .min(1)
    .regex(/\d+/gi)
    .transform((v) => Number(v));

// Schema
const configSchema = z.object({
  // APP
  APP_NAME: z.string().min(1),

  // SERVER
  PORT: numeric(),

  // CLIENT
  CLIENT_URL: z.string().url(),

  // JWT
  SECRET_ACCESS: z.string().min(1),
  SECRET_REFRESH: z.string().min(1),
  SECRET_FORGOT_PASSWORD: z.string().min(1),
  SECRET_CONFIRM_EMAIL: z.string().min(1),

  // JWT DURATIONS
  DURATION_ACCESS: z.string().min(2),
  DURATION_FORGOT_PASSWORD: z.string().min(2),
  DURATION_CONFIRM_EMAIL: z.string().min(2),

  // SALT
  SALT: numeric(),

  // SMTP
  SMTP_HOST: z.string().min(1),
  SMTP_PORT: numeric(),
  SMTP_USER: z.string().min(1),
  SMTP_PASS: z.string().min(1),
  SMTP_FROM_NAME: z.string().min(1),
  SMTP_FROM_ADDRESS: z.string().email(),

  // DATABASE
  DATABASE_URL: z.string().min(1),
});

// parse config
const config = configSchema.safeParse(process.env);

if (!config.success) {
  // throw the error message
  throw Error(config.error.message);
}

// export config data
export default config.data;
