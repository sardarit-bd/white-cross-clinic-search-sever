import OpenAI from "openai";
import { searchAI } from "./searchEngine.js";
import { extractJsonArray } from "./jsonExtractor.js";

export async function handleMCPRequest(body) {
  const { method, params, id } = body;

  const client = new OpenAI({
    apiKey: process.env.OPENAI_API
  });

  // 1️⃣ Handshake
  if (method === "initialize") {
    return {
      jsonrpc: "2.0",
      id,
      result: {
        protocolVersion: "2024-11-05",
        capabilities: {},
        serverInfo: { name: "clinic-ai-search", version: "1.0.0" },
      },
    };
  }

  // 2️⃣ AI Search
  if (method === "tools/call" && params.name === "ai_search") {
    const { query } = params.arguments;

    const localResults = searchAI(query);
    let aiResults = [];

    // 🧠 AI WEB SEARCH
    try {
      const prompt = `
Return ONLY a JSON array.

Search the web for REAL doctors and articles related to "${query}".

Doctor format:
{
  "type":"doctor",
  "name":"",
  "specialization":"",
  "department":"",
  "experience":"",
  "focusAreas":"",
  "email":"",
  "phone":"",
  "hospital":"",
  "link":""
}

Article format:
{
  "type":"article",
  "title":"",
  "excerpt":"",
  "author":"",
  "publishedDate":"",
  "category":"",
  "readingTime":"",
  "link":""
}

Rules:
- Must use real public data
- Must include real links
- No fake info
- Output ONLY JSON array
`;

      const aiResp = await client.responses.create({
        model: "gpt-4o-mini",
        tools: [{ type: "web_search" }],
        input: prompt,
      });

      const cleaned = extractJsonArray(aiResp.output_text);
      aiResults = cleaned || [];
    } catch (err) {
      console.error("❌ AI error:", err.message);
      aiResults = [];
    }

    return {
      jsonrpc: "2.0",
      id,
      result: {
        content: [
          {
            type: "text",
            text: JSON.stringify(
              {
                success: true,
                query,
                localResults,
                aiResults,
                count: {
                  local: localResults.length,
                  ai: aiResults.length,
                },
              },
              null,
              2
            ),
          },
        ],
      },
    };
  }

  // ❌ Unknown Method
  return {
    jsonrpc: "2.0",
    id,
    error: { code: -32601, message: "Method not found" },
  };
}
