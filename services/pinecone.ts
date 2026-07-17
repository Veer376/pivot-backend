/* 
1. https://docs.pinecone.io/guides/get-started/quickstart#1-install-an-sdk
2. Create and plug in the pinecone api key.
3. https://docs.pinecone.io/guides/index-data/create-an-index#bring-your-own-vectors
4. https://docs.pinecone.io/guides/index-data/upsert-data#upsert-dense-vectors
5. https://docs.pinecone.io/guides/search/semantic-search#search-with-a-dense-vector

*/

import { Pinecone } from '@pinecone-database/pinecone'
import dotenv from 'dotenv';
import type { PineconeRecord } from '@pinecone-database/pinecone';

dotenv.config();
// export PINCECONE_API_KEY=your_pinecone_api_key or embed the key in the .env
const pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY || "" });
const indexName = 'rag-project';
const namespace = 'me';

const ensureIndexAndUpsertVectors = async (records: PineconeRecord[]) => {

    // Create.
    const indexes = await pc.listIndexes();

    const indexesByName = indexes.indexes?.map(index => index.name) || []

    if (!indexesByName.includes(indexName)) {

        await pc.createIndex({
            name: indexName,
            vectorType: 'dense',
            dimension: 64, //Same as embeddings from the gemini. 
            metric: 'cosine',
            spec: {
              serverless: {
                cloud: 'aws',
                region: 'us-east-1'
              }
            },
            deletionProtection: 'disabled',
            tags: { environment: 'development' }, 
        });
    }
    
    pc.index(indexName).namespace(namespace).upsert({ records })

}

const query = async(queryVector: number[]) => {

    const index = pc.index(indexName).namespace(namespace);

    const queryResponse = await index.query({
        vector: queryVector,
        topK: 1,
        includeValues: false,
        includeMetadata: true,
    })

    return queryResponse;
}


export { ensureIndexAndUpsertVectors, query }
