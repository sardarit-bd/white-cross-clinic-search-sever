import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { handleMCPRequest } from "./core/mcpHandler.js";
import { searchAI } from "./core/searchEngine.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000'
}));

// -----------------------
// MCP ENDPOINT
// -----------------------
app.post("/mcp", async (req, res) => {
  const response = await handleMCPRequest(req.body);
  return res.json(response);
});

// -----------------------
// LOCAL SEARCH ENDPOINT
// -----------------------
app.post("/search", (req, res) => {
  const { query } = req.body;
  const results = searchAI(query);

  return res.json({
    success: true,
    query,
    results,
    count: results.length,
  });
});

// -----------------------
const PORT = 3001;
app.listen(PORT, () =>
  console.log(`🔥 Local MCP server running on http://localhost:${PORT}`)
);
