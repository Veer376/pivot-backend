import { GoogleGenAI } from "@google/genai";
import { Document } from "@langchain/core/documents";

const ai = new GoogleGenAI({});

async function main() {

    const response = await ai.models.embedContent({
        model: 'gemini-embedding-2',
        contents: 'What is the meaning of life?',
    });

    console.log(response.embeddings);
}

async function generateEmbedding(docs: Document[]) {

    const geminiContents = docs.map(doc => {
      return {
        role: 'user',
        parts: [
          { text: doc.pageContent }
        ]
      }
    })

    const response = await ai.models.embedContent({
        model: 'gemini-embedding-2',
        contents: geminiContents,
        config: {
          outputDimensionality: 64,
        }
    });

    return response.embeddings || [];
}

export { generateEmbedding };
