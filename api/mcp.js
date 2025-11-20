import { handleMCPRequest } from "../core/mcpHandler.js";

export default async function handler(req, res) {

  if (req.method !== "POST")
    return res.status(405).json({ error: "POST only" });

  const response = await handleMCPRequest(req.body);
  return res.json(response);
}
