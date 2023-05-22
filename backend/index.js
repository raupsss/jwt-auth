import express from "express";
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";
import db from "./config/Database.js";
import router from "./routes/index.js";
import cors from 'cors';

dotenv.config();

const app = express();

try {
  await db.authenticate();
  console.log("Database connected...");
} catch (error) {
  console.error(error);
}

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,            //access-control-allow-credentials:true
  optionSuccessStatus: 200
}
app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json());
app.use(router);

app.listen(5000, () => console.log("Server running on port 5000"));
