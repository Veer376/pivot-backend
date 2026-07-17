import Groq from "groq-sdk";
import dotenv from "dotenv";
import { query } from "./pinecone.ts";
import { generateEmbedding } from "./embedding.ts";
import { Document } from "@langchain/core/documents"

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default async function getGroqResponse(messages, model) {

  const contents = []

  for (const message of messages) {
    contents.push({
      role: message.role,
      content: message.content
    })
  }

  // generate the embeddings
  const queryEmbedding = await generateEmbedding([new Document({ pageContent: messages[messages.length - 1].content })]);

  const queryResponse = await query(queryEmbedding[0].values || []);

  // Write the system instruction.
  contents.push({
    role: "system",
    content: "You are a helpful assistant. Always answer based on the provided context. If the context does not contain the answer, respond with 'I don't know'. Make sure that you provider the source of the information you provide in your answer. If the context contains multiple sources, provide all of them in your answer."
  })

  let context = "";

  for (const match of queryResponse.matches) {
    context += `Context: ${match.metadata?.chunk}\n Source: ${match.metadata?.source}\n\n`;
  }

  const finalContents = [
    ...contents.slice(0, -1),
    {
      role: "user",
      content: (contents[contents.length - 2]?.content || "") + "\n\nRetrieved Context:\n" + context
    },
    contents[contents.length - 1]
  ];

  const chatCompletion = await groq.chat.completions.create({
    messages: finalContents,
    model: model,
  });

  const content = chatCompletion.choices[0]?.message?.content || "";
  console.log("Groq Response:", content);
  return content
}

export async function getGroqStreamResponse(messages, model, send) {
  const contents = []

  for (const message of messages) {
    contents.push({
      role: message.role,
      content: message.content
    })
  }

  const queryEmbedding = await generateEmbedding([new Document({ pageContent: messages[messages.length - 1].content })]);
  const queryResponse = await query(queryEmbedding[0].values || []);

  contents.push({
    role: "system",
    content: "You are a helpful assistant. Always answer based on the provided context. If the context does not contain the answer, respond with 'I don't know'. Make sure that you provider the source of the information you provide in your answer. If the context contains multiple sources, provide all of them in your answer."
  })

  let context = "";

  for (const match of queryResponse.matches) {
    context += `Context: ${match.metadata?.chunk}\n Source: ${match.metadata?.source}\n\n`;
  }

  const finalContents = [
    ...contents.slice(0, -1),
    {
      role: "user",
      content: (contents[contents.length - 2]?.content || "") + "\n\nRetrieved Context:\n" + context
    },
    contents[contents.length - 1]
  ];

  const stream = await groq.chat.completions.create({
    messages: finalContents,
    model: model,
    stream: true,
  });

  for await (const chunk of stream) {
    if (chunk.choices[0]?.delta?.content) {
      send({ content: chunk.choices[0].delta.content });
    }
  }
}