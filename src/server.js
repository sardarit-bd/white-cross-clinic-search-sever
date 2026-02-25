import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import { envVars } from "./config/env.js";
import { router } from "./routes/index.js";
import { globalErrorHandle } from "./middlewares/globalErrorHandler.js";
import { notFound } from "./middlewares/notFound.js";
import { seedSuperAdmin } from "./utils/seedSuperAdmin.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:3000', 'https://white-cross-clinic-frontend.vercel.app'],
  credentials: true
}));

// app.use(async (req, res, next) => {
//   try {
//     await mongoose.connect(envVars.DB_URL, {
//       serverSelectionTimeoutMS: 30000,
//       connectTimeoutMS: 30000,
//     })
//     console.log('Connected to DB')
//     next();
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: 'Database connection failed',
//       error: error.message
//     });
//   }
// });

app.use("/api", router);

app.get("/", (req, res) => {
  res.send("Server is running.");
});
// -----------------------
// MCP ENDPOINT
// -----------------------
// app.post("/mcp", async (req, res) => {
//   const response = await handleMCPRequest(req.body);
//   return res.json(response);
// });

// -----------------------
// LOCAL SEARCH ENDPOINT
// -----------------------
// app.post("/search", (req, res) => {
//   const { query } = req.body;
//   const results = searchAI(query);

//   return res.json({
//     success: true,
//     query,
//     results,
//     count: results.length,
//   });
// });
app.use(globalErrorHandle);

app.use(notFound);



const PORT = 5000;
const startServer = async () => {
  try {
    await mongoose.connect(envVars.DB_URL, {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
    })
    console.log('Connected to DB')
  } catch (err) {
    console.log(err)
  }
}

(async () => {
  await startServer()
  seedSuperAdmin()
})()

  app.listen(PORT, () =>
    console.log(`🔥 Local server running on http://localhost:${PORT}`)
  );

export default app;

