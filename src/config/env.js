
export const env = {
  PORT:process.env.PORT || 3000,
  DATABASE_URL: process.env.DATABASE_URL,
  SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS),
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET
}