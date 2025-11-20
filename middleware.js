export function middleware(req) {
  const res = new Response(null, { status: 200 });

  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // If it's a preflight request → return immediately
  if (req.method === "OPTIONS") return res;

  return;
}

export const config = {
  matcher: "/api/:path*", // apply CORS to all API routes
};
