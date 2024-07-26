// src/index.ts
import cookieParser from "cookie-parser";
import express, { Application } from "express";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import postRoutes from "./routes/postRoutes";
import cors from "cors"
import dotenv from "dotenv";

dotenv.config();

const app: Application = express();
app.use(express.json());
app.use("/images", express.static("uploads"));
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))
app.use(cookieParser());
// Подключаем маршруты
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

const PORT: number = parseInt(process.env.PORT as string, 10) || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
