import { and, eq, sql } from "drizzle-orm";
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
import { generateAnswer, generateEmbeddings } from "../../services/gemini.ts";

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
					errors: ["A sala não existe"],
					data: null,
				});
			}

			const embeddings = await generateEmbeddings(question);

			const embeddingsAsString = `[${embeddings.join(",")}]`;

			const chunks = await db
				.select({
					id: schema.audioChunks.id,
					transcription: schema.audioChunks.transcription,
					similarity: sql<number>`1 - (${schema.audioChunks.embeddings} <=> ${embeddingsAsString}::vector)`,
				})
				.from(schema.audioChunks)
				.where(
					and(
						eq(schema.audioChunks.roomId, roomId),
						sql`1 - (${schema.audioChunks.embeddings} <=> ${embeddingsAsString}::vector) > 0.5`
					)
				)
				.orderBy(
					sql`1 - (${schema.audioChunks.embeddings} <=> ${embeddingsAsString}::vector)`
				)
				.limit(3);

			let answer: string | null = null;

			if (chunks.length > 0) {
				const transcriptions = chunks.map((chunk) => chunk.transcription);

				answer = await generateAnswer(question, transcriptions);
			}

			const [newQuestion] = await db
				.insert(schema.questions)
				.values({
					roomId,
					question,
					answer,
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
