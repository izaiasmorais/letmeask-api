import { z } from "zod";

export const createQuestionParamsSchema = z.object({
	roomId: z.string(),
});

export const createQuestionBodySchema = z.object({
	question: z.string().min(1),
});

export const createQuestionResponseSchema = z.object({
	id: z.string(),
	roomId: z.string(),
	question: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
});
