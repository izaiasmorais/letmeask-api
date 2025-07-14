import { z } from "zod";

export const envSchema = z.object({
	PORT: z.coerce.number().default(3000),
	NODE_ENV: z.enum(["developer", "production"]).default("developer"),
	DATABASE_URL: z.string().startsWith("postgresql://"),
	VERSION: z.string(),
	GEMINI_API_KEY: z.string(),
});

export const env = envSchema.parse(process.env);
