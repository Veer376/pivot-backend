import { loadWebPage } from "../services/documentLoader.ts";
import { splitDocuments } from "../services/documentSplitter.ts";

async function testRAG() {


    const docs = await loadWebPage("https://lilianweng.github.io/posts/2023-06-23-agent/")

    console.log("Documents loaded", docs[0].pageContent.length);

    const splits = await splitDocuments(docs);

    console.log("Documents split", splits.length);

    const truncatedSplits = splits.slice(0, 20);

    console.log("Truncated splits", truncatedSplits.length);

    // Generate embeddings for the documents.

    


}

await testRAG();