import express from "express";
import cors from "cors";
import { searchAI } from "./searchEngine.js";
import OpenAI from "openai";

import dotenv from "dotenv";
dotenv.config();

// ----------------------------
// OPENAI CLIENT
// ----------------------------
const client = new OpenAI({
  apiKey: process.env.OPENAI_API,
});

// ----------------------------
// JSON EXTRACTOR (THE FIX)
// ----------------------------
function extractJsonArray(text) {
  if (!text) return null;

  // Remove markdown fences such as ```json or ```
  text = text.replace(/```json/gi, "")
             .replace(/```/g, "")
             .trim();

  // Extract first JSON array bracket
  const match = text.match(/\[[\s\S]*\]/);
  if (!match) return null;

  try {
    return JSON.parse(match[0]);
  } catch (error) {
    console.error("❌ JSON parse error:", error.message);
    return null;
  }
}

// ----------------------------
// EXPRESS APP
// ----------------------------
const app = express();
app.use(express.json());

// CORS
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["POST", "GET", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Accept"],
  })
);

// ----------------------------
// MCP ENDPOINT
// ----------------------------
app.post("/mcp", async (req, res) => {
  try {
    console.log("📩 Incoming MCP request:", req.body);

    const { method, params, id } = req.body;

    // 1️⃣ INITIALIZE (handshake)
    if (method === "initialize") {
      return res.json({
        jsonrpc: "2.0",
        id,
        result: {
          protocolVersion: "2024-11-05",
          capabilities: {},
          serverInfo: {
            name: "clinic-ai-search",
            version: "1.0.0",
          },
        },
      });
    }

    // 2️⃣ AI SEARCH TOOL
    if (method === "tools/call" && params.name === "ai_search") {
      const { query } = params.arguments;

      // ----------------------------------
      // LOCAL DATABASE SEARCH
      // ----------------------------------
      const localResults = searchAI(query);
      console.log("📌 Local Results:", localResults.length);

      // ----------------------------------
      // OPENAI WEB SEARCH (REAL DATA)
      // ----------------------------------
      let aiResults = [];

      try {
        const prompt = `
IMPORTANT: Return ONLY a JSON array. No explanation. No markdown.

Search the web and extract REAL doctors and medical articles related to "${query}"

=================================
DOCTOR OBJECT FORMAT
=================================
{
  "type": "doctor",
  "name": "",
  "specialization": "",
  "department": "",
  "experience": "",
  "focusAreas": "",
  "email": "",
  "phone": "",
  "hospital": "",
  "link": ""
}

=================================
ARTICLE OBJECT FORMAT
=================================
{
  "type": "article",
  "title": "",
  "excerpt": "",
  "author": "",
  "publishedDate": "",
  "category": "",
  "readingTime": "",
  "link": ""
}

RULES:
- MUST use real public data
- MUST include real clickable links
- No fictional names
- No explanation or text outside JSON
- Output MUST be ONLY raw JSON array
`;

        const aiResp = await client.responses.create({
          model: "gpt-4o-mini",
          tools: [{ type: "web_search" }],
          input: prompt,
        });

        const rawText = aiResp.output_text.trim();
       

        aiResults = extractJsonArray(rawText);

        if (!aiResults) {
          console.warn("⚠️ AI returned non-JSON structure.");
          aiResults = [];
        }
      } catch (err) {
        console.error("❌ AI WebSearch error:", err.message);
      }

      // ----------------------------------
      // FINAL STRUCTURED RESPONSE
      // ----------------------------------
      const responsePayload = {
        success: true,
        query,
        localResults,
        aiResults,
        count: {
          local: localResults.length,
          ai: aiResults.length,
        },
      };
      return res.json({
        jsonrpc: "2.0",
        id,
        result: {
          content: [
            { type: "text", text: JSON.stringify(responsePayload, null, 2) },
          ],
        },
      });
    }

    // Unknown method
    return res.json({
      jsonrpc: "2.0",
      id,
      error: { code: -32601, message: "Method not found" },
    });
  } catch (err) {
    console.error("🔥 MCP INTERNAL ERROR:", err);
    res.status(500).json({
      jsonrpc: "2.0",
      id: req.body?.id || null,
      error: {
        code: -32603,
        message: "Internal Server Error",
        data: err.message,
      },
    });
  }
});

// ----------------------------
// DIRECT LOCAL SEARCH
// ----------------------------
app.post("/search", (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: "Query required" });

    const results = searchAI(query);
    res.json({
      success: true,
      query,
      results,
      count: results.length,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ----------------------------
// HEALTH CHECK
// ----------------------------
app.get("/health", (_, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// ----------------------------
// SERVER START
// ----------------------------
const PORT = 3001;
app.listen(PORT, () =>
  console.log(`🚀 MCP + WebSearch Server running at http://localhost:${PORT}`)
);
