import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { db } from "../../db/connection.ts";
import { schema } from "../../db/schemas/index.ts";
import { errorSchema, successSchema } from "../../schemas/http.ts";
import {
	createRoomBodySchema,
	createRoomResponseSchema,
} from "../../schemas/rooms.ts";

export function createRoom(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		"/rooms",
		{
			schema: {
				tags: ["Rooms"],
				operationId: "createRoom",
				summary: "Create a new room",
				body: createRoomBodySchema,
				response: {
					201: successSchema(createRoomResponseSchema).describe("Created"),
					400: errorSchema.describe("Bad Request"),
				},
			},
		},
		async (request, reply) => {
			const { name, description } = request.body;

			const [room] = await db
				.insert(schema.rooms)
				.values({
					name,
					description,
				})
				.returning();

			return reply.code(201).send({
				success: true,
				errors: null,
				data: room,
			});
		}
	);
}
