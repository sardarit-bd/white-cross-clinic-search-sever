import { handleMCPRequest } from "../core/mcpHandler.js";

export default async function handler(req, res) {
   // ----- ENABLE CORS -----
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method !== "POST")
    return res.status(405).json({ error: "POST only" });

  const response = await handleMCPRequest(req.body);
  return res.json(response);
}
