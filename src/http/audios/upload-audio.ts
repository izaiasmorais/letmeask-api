import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../../db/connection.ts";
import { schema } from "../../db/schemas/index.ts";
import { errorSchema, successSchema } from "../../schemas/http.ts";
import { generateEmbeddings, transcribeAudio } from "../../services/gemini.ts";

export function uploadAudio(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		"/rooms/:roomId/audio",
		{
			schema: {
				tags: ["Audios"],
				operationId: "uploadAudio",
				summary: "Upload a new audio in a room",
				params: z.object({
					roomId: z.string(),
				}),
				response: {
					201: successSchema(
						z.object({
							chunkId: z.string(),
						})
					).describe("Created"),
					400: errorSchema.describe("Bad Request"),
					404: errorSchema.describe("Room not found"),
				},
			},
		},
		async (request, reply) => {
			const { roomId } = request.params;

			const audio = await request.file();

			if (!audio) {
				return reply.code(400).send({
					success: false,
					errors: ["Áudio não encontrado"],
					data: null,
				});
			}

			const audioBuffer = await audio.toBuffer();
			const audioAsBase64 = audioBuffer.toString("base64");

			const transcription = await transcribeAudio(
				audioAsBase64,
				audio.mimetype
			);

			const embeddings = await generateEmbeddings(transcription);

			const result = await db
				.insert(schema.audioChunks)
				.values({
					roomId,
					transcription,
					embeddings,
				})
				.returning();

			const chunk = result[0];

			if (!chunk) {
				return reply.code(500).send({
					success: false,
					errors: ["Não foi possível salvar o áudio"],
					data: null,
				});
			}

			return reply.code(201).send({
				success: true,
				errors: null,
				data: {
					chunkId: chunk.id,
				},
			});
		}
	);
}
