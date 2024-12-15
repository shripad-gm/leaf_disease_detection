import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"

import authRoutes from "./routes/auth.routes.js"


import connectToMongo from "./db/connectToMongo.js";

dotenv.config();

const app = express()
const PORT = process.env.PORT ||3000
app.use(cookieParser());

app.use(express.json());
app.use("/api/auth",authRoutes)



app.listen(PORT, () => {
  connectToMongo();
  console.log(`app listening on port ${PORT}`)
})