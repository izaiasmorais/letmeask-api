import z from "zod";

export const roomsSchema = z.array(
	z.object({
		id: z.string(),
		name: z.string(),
	})
);
