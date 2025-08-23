// server/index.ts
import express from "express";
import dotenv from "dotenv";
import routes from "./routes";

dotenv.config();

const app = express();
app.use(express.json({ limit: "1mb" }));

// Routes
app.use("/api", routes);

// Start server
const port = Number(process.env.PORT) || 3000;
const host = "0.0.0.0";
app.listen(port, host, () => {
  console.log(`✅ Express server running on port ${port}`);
});

// Simple AI endpoint
import OpenAI from "openai";
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post("/api/chat", async (req, res) => {
  try {
    const userMessage = req.body.message || "";
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Tu es un partenaire de conversation en 
français. Réponds naturellement et pose aussi des questions." },
        { role: "user", content: userMessage }
      ],
    });

    const reply = response.choices[0]?.message?.content?.trim() || "Je 
n’ai pas compris. Peux-tu répéter ?";
    res.json({ reply });
  } catch (err) {
    console.error("API error:", err);
    res.status(500).json({ reply: "Oups, un problème est survenu." });
  }
});

export default app;

