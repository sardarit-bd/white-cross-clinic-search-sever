export function extractJsonArray(text) {
  if (!text) return null;

  // Remove markdown fences
  text = text.replace(/```json/gi, "")
             .replace(/```/g, "")
             .trim();

  const match = text.match(/\[[\s\S]*\]/);
  if (!match) return null;

  try {
    return JSON.parse(match[0]);
  } catch (e) {
    console.error("❌ JSON parse error:", e.message);
    return null;
  }
}
