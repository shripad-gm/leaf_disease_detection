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

app.use(express.json());
app.use("/api/auth",authRoutes)
app.use("/api/history",historyRoutes)



app.listen(PORT, () => {
  connectToMongo();
  console.log(`app listening on port ${PORT}`)
})