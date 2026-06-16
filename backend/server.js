import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import path from "path"
import { fileURLToPath } from "url"

import authRoutes from "./routes/auth.routes.js"
import historyRoutes from "./routes/history.routes.js"


import connectToMongo from "./db/connectToMongo.js";

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const app = express()
const PORT = process.env.PORT ||3000
app.use(cookieParser());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use("/api/auth",authRoutes)
app.use("/api/history",historyRoutes)

// Serve frontend static assets from the built distribution
const frontendDistPath = path.join(__dirname, "..", "frontend", "dist");
app.use(express.static(frontendDistPath));

// Fallback all non-API routing to index.html for React Router compatibility
app.get("*", (req, res) => {
  if (!req.path.startsWith("/api")) {
    res.sendFile(path.join(frontendDistPath, "index.html"));
  } else {
    res.status(404).json({ error: "API route not found" });
  }
});

app.listen(PORT, () => {
  connectToMongo();
  console.log(`app listening on port ${PORT}`)
})