import { z } from "zod";

const env = Bun.env;

const envConfig = z.object({
	NODE_ENV: z.string().default("development"),
	PORT: z.string().default("3000"),
	GOOGLE_API: z.string().min(1),
	CX: z.string().min(1),
	OLLAMA_MODEL: z.string().min(1),
	OLLAMA_EMBEDDING: z.string().min(1),
});

export const config = envConfig.parse(env);
