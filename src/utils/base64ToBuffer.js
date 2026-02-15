export const base64ToBuffer = (base64) => {
  const matches = base64.match(/^data:(.+);base64,(.+)$/);
  if (!matches) {
    throw new Error("Invalid base64 string");
  }
  return Buffer.from(matches[2], "base64");
};