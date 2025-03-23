import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import OpenAI from "openai";

dotenv.config();
const app = express();
const port = process.env.PORT || 3001;
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.post("/generate-code", async (req, res) => {
  const { image, platform } = req.body;

  const prompt = `Analyze this UI image and generate clean, semantic ${platform} code that recreates the layout. Use logical structure and placeholder content.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: { url: `data:image/jpeg;base64,${image}` },
            },
          ],
        },
      ],
      max_tokens: 2000,
    });

    const code = response.choices[0].message.content;
    res.status(200).json({ code });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate code" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
