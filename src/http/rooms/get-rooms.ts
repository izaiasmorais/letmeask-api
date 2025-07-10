import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { db } from "../../db/connection.ts";
import { schema } from "../../db/schema/index.ts";
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
				})
				.from(schema.rooms)
				.orderBy(schema.rooms.createdAt);

			return reply.send({
				success: true,
				errors: null,
				data,
			});
		}
	);
}
