import { count, eq } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { db } from "../../db/connection.ts";
import { schema } from "../../db/schemas/index.ts";
import { errorSchema, successSchema } from "../../schemas/http.ts";
import { roomsSchema } from "../../schemas/rooms.ts";

export function getRooms(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().get(
		"/rooms",
		{
			schema: {
				tags: ["Rooms"],
				operationId: "getRooms",
				summary: "Get all rooms",
				response: {
					200: successSchema(roomsSchema).describe("Success"),
					400: errorSchema.describe("Bad Request"),
					404: errorSchema.describe("Not Found"),
				},
			},
		},
		async (_, reply) => {
			const data = await db
				.select({
					id: schema.rooms.id,
					name: schema.rooms.name,
					questionsCount: count(schema.questions.id),
					createdAt: schema.rooms.createdAt,
					updatedAt: schema.rooms.updatedAt,
				})
				.from(schema.rooms)
				.leftJoin(
					schema.questions,
					eq(schema.questions.roomId, schema.rooms.id)
				)
				.groupBy(schema.rooms.id, schema.rooms.name)
				.orderBy(schema.rooms.createdAt);

			return reply.send({
				success: true,
				errors: null,
				data,
			});
		}
	);
}
