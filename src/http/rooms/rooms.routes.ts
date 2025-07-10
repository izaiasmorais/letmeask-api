import type { FastifyInstance } from "fastify";
import { getRooms } from "./get-rooms.ts";

export function roomsRoutes(app: FastifyInstance) {
	app.register(getRooms);
}
