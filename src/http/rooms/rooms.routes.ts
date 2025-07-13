import type { FastifyInstance } from "fastify";
import { createQuestion } from "./create-question.ts";
import { createRoom } from "./create-room.ts";
import { getRoomById } from "./get-room-by-id.ts";
import { getRooms } from "./get-rooms.ts";

export function roomsRoutes(app: FastifyInstance) {
	app.register(getRooms);
	app.register(createRoom);
	app.register(getRoomById);
	app.register(createQuestion);
}
