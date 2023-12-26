import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"], // This is the default and can be omitted
});

async function main(todo) {
  const chatCompletion = await openai.chat.completions.create({
    messages: [
      { role: "user", content: "help me to finish this todo: " + todo },
    ],
    model: "gpt-3.5-turbo",
  });

  console.log(chatCompletion.choices);
  return chatCompletion.choices;
}

export async function POST(req) {
  const data = await req.json();
  console.log(data);
  let choices = await main(data.todo);
  return NextResponse.json({ "text": choices[0].message.content });
}
