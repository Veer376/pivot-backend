import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default async function getGroqResponse(messages) {

  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: "Explain the importance of fast language models",
      },
    ],
    model: "llama-3.1-8b-instant",
  });

  const content = chatCompletion.choices[0]?.message?.content || "";
  console.log("Groq Response:", content);
  return content
}