import dotenv from "dotenv"
dotenv.config()

export const { PORT, DATABASE_URL, NODE_ENV, REDIS_URL } = process.env