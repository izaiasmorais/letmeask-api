import type { FastifyInstance } from "fastify";
import { createQuestion } from "./create-question.ts";
import { createRoom } from "./create-room.ts";
import { getRoomQuestions } from "./get-room-questions.ts";
import { getRooms } from "./get-rooms.ts";

export function roomsRoutes(app: FastifyInstance) {
	app.register(getRooms);
	app.register(createRoom);
	app.register(getRoomQuestions);
	app.register(createQuestion);
}
