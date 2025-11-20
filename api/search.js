import { searchAI } from "../core/searchEngine.js";

export default function handler(req, res) {
  const { query } = req.body;
  const results = searchAI(query);

  return res.json({
    success: true,
    query,
    results,
    count: results.length,
  });
}
