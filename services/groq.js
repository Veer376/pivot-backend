import Groq from "groq-sdk";
import dotenv from "dotenv";

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

  // Write the system instruction.
  contents.push({
    role: "system",
    content: "You are a helpful assistant. Always answer in a short concise and technical manner as we are engineers you are talking to."
  })

  const chatCompletion = await groq.chat.completions.create({
    messages: contents,
    model: model,
  });

  const content = chatCompletion.choices[0]?.message?.content || "";
  console.log("Groq Response:", content);
  return content
}