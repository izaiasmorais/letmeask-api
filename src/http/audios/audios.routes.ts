import type { FastifyInstance } from "fastify";
import { uploadAudio } from "./upload-audio.ts";

export function audiosRoutes(app: FastifyInstance) {
	app.register(uploadAudio);
}
