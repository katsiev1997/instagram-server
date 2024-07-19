import express from "express";
import postController from "../controllers/postController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

// Создание нового поста с изображением
router.post("/", authMiddleware, upload.single("image"), postController.createPost);

// Обновление поста
router.put("/:id", authMiddleware, postController.updatePost);

// Удаление поста
router.delete("/:id", authMiddleware, postController.deletePost);

export default router;
