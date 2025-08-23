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
 { role: "system", content: "You are Buddy, a helpful French conversation partner.",}, 
        { role: "user", content: message },
      ],
    });

    return res.json({
      reply: completion.choices[0].message?.content || "Pas de réponse",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong." });
  }
});

export default router;

