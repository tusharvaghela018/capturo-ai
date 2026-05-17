import { Server } from "socket.io";
import http from "http";
import logger from "@/utils/logger";

class SocketService {
    private static instance: SocketService;
    private _io: Server | null = null;

    private constructor() { }

    public static getInstance(): SocketService {
        if (!SocketService.instance) {
            SocketService.instance = new SocketService();
        }
        return SocketService.instance;
    }

    public initialize(server: http.Server): void {
        if (this._io) {
            logger.warn("Socket.io is already initialized");
            return;
        }

        this._io = new Server(server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
                credentials: true
            }
        });

        this._io.on("connection", (socket) => {
            logger.info(`Socket connected: ${socket.id}`);

            socket.on("disconnect", () => {
                logger.info(`Socket disconnected: ${socket.id}`);
            });
        });

        logger.info("Socket.io initialized");
    }

    public get io(): Server {
        if (!this._io) {
            throw new Error("Socket.io is not initialized. Call initialize(server) first.");
        }
        return this._io;
    }
}

export default SocketService.getInstance();
