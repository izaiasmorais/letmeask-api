import { eq } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { db } from "../../db/connection.ts";
import { schema } from "../../db/schemas/index.ts";
import { errorSchema, successSchema } from "../../schemas/http.ts";
import {
	createQuestionBodySchema,
	createQuestionParamsSchema,
	createQuestionResponseSchema,
} from "../../schemas/questions.ts";

export function createQuestion(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		"/rooms/:roomId/questions",
		{
			schema: {
				tags: ["Questions"],
				operationId: "createQuestion",
				summary: "Create a new question in a room",
				params: createQuestionParamsSchema,
				body: createQuestionBodySchema,
				response: {
					201: successSchema(createQuestionResponseSchema).describe("Created"),
					400: errorSchema.describe("Bad Request"),
					404: errorSchema.describe("Room not found"),
				},
			},
		},
		async (request, reply) => {
			const { roomId } = request.params;
			const { question } = request.body;

			const roomExists = await db
				.select({ id: schema.rooms.id })
				.from(schema.rooms)
				.where(eq(schema.rooms.id, roomId))
				.limit(1);

			if (!roomExists.length) {
				return reply.code(404).send({
					success: false,
					errors: ["Room not found"],
					data: null,
				});
			}

			const [newQuestion] = await db
				.insert(schema.questions)
				.values({
					roomId,
					question,
				})
				.returning();

			return reply.code(201).send({
				success: true,
				errors: null,
				data: newQuestion,
			});
		}
	);
}
