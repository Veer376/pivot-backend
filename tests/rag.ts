import { loadWebPage } from "../services/documentLoader.ts";
import { splitDocuments } from "../services/documentSplitter.ts";
import { generateEmbedding } from "../services/embedding.ts";
import { ensureIndexAndUpsertVectors, query } from "../services/pinecone.ts";
import { Document } from "@langchain/core/documents";

async function testRAG() {


    const docs = await loadWebPage("https://lilianweng.github.io/posts/2023-06-23-agent/")

    console.log("Documents loaded", docs[0].pageContent.length);

    const splits = await splitDocuments(docs);

    console.log("Documents split", splits.length);

    const truncatedSplits = splits.slice(0, 1);

    console.log("Truncated splits", truncatedSplits.length);

    // Generate embeddings for the documents.

    const embeddings = await generateEmbedding(truncatedSplits);

    console.log("Embeddings generated", embeddings.length);
    console.log("First embedding", embeddings[0].values);

    const pineconeRecords = embeddings.map((embedding, index) => {
        return {
            id: `record-${index}`,
            values: embedding.values,
            metadata: {
                source: truncatedSplits[index].metadata.source,
                chunk: truncatedSplits[index].pageContent,
            }
        }
    })

    await ensureIndexAndUpsertVectors(pineconeRecords);



    // PHASE 2: Query the index with a question.

    const queryVector = await generateEmbedding([new Document({
        pageContent: "what is LLM?"
    })])

    // Test the query.
    const queryResponse = await query(queryVector[0].values || []);

    queryResponse.matches?.forEach((match) => {
        console.log(`match id: ${match.id}, score: ${match.score}, metadata: ${match.metadata?.source.toString()}`);
    })
}

await testRAG();