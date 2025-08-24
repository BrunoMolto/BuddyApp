import * as  express from "express";
import * as OpenAI from "openai";  

const router = express.Router();
const client = new OpenAI.OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const completion = await client.chat.completions.create({

      model: "gpt-4o-mini",
      messages: [
 { role: "system", content: "Tu es un partenaire de conversation en français. Réponds naturellement en français, donne des réponses variées et pose aussi des questions pour continuer la 
discussion." }, 
        { role: "user", content: message },
      ],
    });

    return res.json({
      reply: completion.choices[0]?.message?.content[0]?.text || "Pas de réponse",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

export default router;

