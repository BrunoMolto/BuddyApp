// server/index.ts
import "dotenv/config";
import express from "express";
import routes from "./routes";

const app = express();
import path from "path";

app.get("/", (_req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "index.html"));
});

// Middleware
app.use(express.json({ limit: "1mb" }));

// Routes
app.use("/", routes);

// Start server
const port = Number(process.env.PORT) || 3000;
const host = "0.0.0.0";
app.listen(port, host, () => {
  console.log(`[express] serving on port ${port}`);
});

export default app;

