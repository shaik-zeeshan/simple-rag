import ollama from "ollama";
import { config } from "./env";

const env = config;

export async function generateResponse(text: string, relevantText: string) {
	const modelQuery = `${text} - Answer that question using the following text as a resource: ${relevantText}`;
	const stream = await ollama.generate({
		model: env.OLLAMA_MODEL,
		prompt: modelQuery,
		stream: true,
	});

	for await (const chunk of stream) {
		process.stdout.write(chunk.response);
	}
}

export async function generateEmbeddings(prompt: string) {
	const embeddings = await ollama.embeddings({
		model: env.OLLAMA_EMBEDDING,
		prompt,
	});
	return embeddings;
}
