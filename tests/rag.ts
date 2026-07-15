import { loadWebPage } from "../services/documentLoader.ts";
import { splitDocuments } from "../services/documentSplitter.ts";
import { generateEmbedding } from "../services/embedding.ts";

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


}

await testRAG();