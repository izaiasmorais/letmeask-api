import z from "zod";

export const roomsSchema = z.array(
	z.object({
		id: z.string(),
		name: z.string(),
		questionsCount: z.number(),
		createdAt: z.date(),
		updatedAt: z.date(),
	})
);

export const createRoomBodySchema = z.object({
	name: z.string().min(1),
	description: z.string().optional(),
});

export const createRoomResponseSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const getRoomQuestionsParamsSchema = z.object({
	roomId: z.string(),
});

export const questionSchema = z.object({
	id: z.string(),
	question: z.string(),
	answer: z.string().nullable(),
	createdAt: z.date(),
});
