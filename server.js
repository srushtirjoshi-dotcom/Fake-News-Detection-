
import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/detect", async (req, res) => {
  try {
    const news = req.body.news;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `
You are an advanced fake news detection AI.

Analyze the news and respond strictly in this format:

Verdict: Real or Fake
Confidence: (percentage)
Explanation: (clear reasoning)
Source Check: (mention if claim seems verifiable or not)

Be accurate and logical.
`
        },
        {
          role: "user",
          content: news
        }
      ],
    });

    const result = response.choices[0].message.content;

    res.json({ result });

  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});