import { eq } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { db } from "../../db/connection.ts";
import { schema } from "../../db/schemas/index.ts";
import { errorSchema, successSchema } from "../../schemas/http.ts";
import {
	getRoomByIdResponseSchema,
	getRoomQuestionsParamsSchema,
} from "../../schemas/rooms.ts";

export function getRoomById(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().get(
		"/rooms/:roomId",
		{
			schema: {
				tags: ["Questions"],
				operationId: "getRoomById",
				summary: "Get room by its id",
				params: getRoomQuestionsParamsSchema,
				response: {
					200: successSchema(getRoomByIdResponseSchema).describe("Success"),
					400: errorSchema.describe("Bad Request"),
					404: errorSchema.describe("Not Found"),
				},
			},
		},
		async (request, reply) => {
			const { roomId } = request.params;

			const [room] = await db
				.select({
					id: schema.rooms.id,
					name: schema.rooms.name,
					createdAt: schema.rooms.createdAt,
				})
				.from(schema.rooms)
				.where(eq(schema.rooms.id, roomId))
				.limit(1);

			if (!room) {
				return reply.status(404).send({
					success: false,
					errors: ["Sala não encontrada"],
					data: null,
				});
			}

			const questions = await db
				.select({
					id: schema.questions.id,
					question: schema.questions.question,
					answer: schema.questions.answer,
					createdAt: schema.questions.createdAt,
				})
				.from(schema.questions)
				.where(eq(schema.questions.roomId, roomId))
				.orderBy(schema.questions.createdAt);

			const data = {
				id: room.id,
				name: room.name,
				questionsCount: questions.length,
				createdAt: room.createdAt,
				questions,
			};

			return reply.send({
				success: true,
				errors: null,
				data,
			});
		}
	);
}
