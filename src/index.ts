import { NLPChunker } from "@orama/chunker";
import { ChromaClient } from "chromadb";
import { generateEmbeddings, generateResponse } from "./ollama";
import { readText } from "./parser";
import { search } from "./search";

const chroma = new ChromaClient({ path: "localhost:8000" });

const collection = await chroma.getOrCreateCollection({
	name: "database_embeddings",
	metadata: { "hnsw:space": "cosine" },
});

const prompt = "Search for a topic: ";
process.stdout.write(prompt);
for await (const line of console) {
	process.stdout.write("Loading...");
	const text = line.trim();
	if (text === "exit") {
		process.exit(0);
	}

	process.stdout.write(`\rSearch for a topic: ${text}`);

	const relevantDocs = await search(text);
	for (const doc of relevantDocs.splice(0, 3)) {
		process.stdout.write(`\rReading the page... ${doc}`);
		const text = await readText(doc);
		const chunks = chunkText(text, 250);

		for await (const [index, chunk] of chunks.entries()) {
			const embed = (await generateEmbeddings(chunk)).embedding;
			if (!embed) {
				continue;
			}

			const embedExist = await collection.query({
				queryEmbeddings: embed,
				where: { ids: doc + index },
			});

			if (embedExist.documents.length) {
				continue;
			}
			await collection.add({
				ids: [doc + index],
				embeddings: [embed],
				metadatas: { source: doc },
				documents: [chunk],
			});
		}
	}

	const queryEmbeddings = (await generateEmbeddings(text)).embedding;
	process.stdout.write("Searching for the answer...");
	const results = await collection.query({
		queryEmbeddings,
		nResults: 5,
	});

	const resultsText = results.documents[0].join("\n");

	await generateResponse(text, resultsText);

	console.log("/n");

	process.stdout.write(prompt);
}

function chunkText(text: string, size = 150) {
	const chunker = new NLPChunker();
	const chunks = chunker.chunk(text, size);
	return chunks;
}
