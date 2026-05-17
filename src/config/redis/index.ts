import { createClient, RedisClientType } from "redis";
import { REDIS_URL } from "@/config";
import logger from "@/utils/logger";

class Redis {
    private static instance: Redis;
    private client: RedisClientType;
    private isConnected: boolean = false;

    private constructor() {
        this.client = createClient({
            url: REDIS_URL || "redis://localhost:6379",
        });

        this.client.on("error", (err) => {
            logger.error("Redis Client Error", err);
        });

        this.client.on("connect", () => {
            logger.info("Redis Client Connected");
            this.isConnected = true;
        });
    }

    public static getInstance(): Redis {
        if (!Redis.instance) {
            Redis.instance = new Redis();
        }
        return Redis.instance;
    }

    public async connect(): Promise<void> {
        try {
            if (!this.isConnected) {
                await this.client.connect();
            }
        } catch (error) {
            logger.error("Failed to connect to Redis", error);
        }
    }

    public get getClient(): RedisClientType {
        return this.client;
    }
}

export default Redis.getInstance();
