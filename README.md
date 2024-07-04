# Simple RAG

# Description

This use ollama for ai models and embedding and for the database we use chromadb

[!IMPORTANT]
before do anything you must have ollama and chromadb installed on your machine
[Ollama](https://ollama.com/)
[Chromadb](https://docs.trychroma.com/getting-started)

# Requirements

- Node.js
- Bun
- Ollama
- Chromadb

# Installation

To install dependencies:

```bash
bun install
```

To Start the database:

```bash
 chroma run --host localhost --port 8000 --path ./chromadb
```

To run:

```bash
bun run start
```

This project was created using `bun init` in bun v1.1.17. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
