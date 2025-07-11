import { eq } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { db } from "../../db/connection.ts";
import { schema } from "../../db/schemas/index.ts";
import { errorSchema, successSchema } from "../../schemas/http.ts";
import {
	getRoomQuestionsParamsSchema,
	questionSchema,
} from "../../schemas/rooms.ts";

export function getRoomQuestions(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().get(
		"/rooms/:roomId/questions",
		{
			schema: {
				tags: ["Questions"],
				operationId: "getRoomQuestions",
				summary: "Get all questions from a room",
				params: getRoomQuestionsParamsSchema,
				response: {
					200: successSchema(z.array(questionSchema)).describe("Success"),
					400: errorSchema.describe("Bad Request"),
					404: errorSchema.describe("Not Found"),
				},
			},
		},
		async (request, reply) => {
			const { roomId } = request.params;

			const data = await db
				.select({
					id: schema.questions.id,
					question: schema.questions.question,
					answer: schema.questions.answer,
					createdAt: schema.questions.createdAt,
				})
				.from(schema.questions)
				.where(eq(schema.questions.roomId, roomId))
				.orderBy(schema.questions.createdAt);

			return reply.send({
				success: true,
				errors: null,
				data,
			});
		}
	);
}
