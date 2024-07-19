import { Request, Response } from "express";
import prisma from "../models/prismaClient"; // Убедитесь, что путь к вашему prismaClient корректный

// Create a new post
const createPost = async (req: Request, res: Response): Promise<Response> => {
  const { content, user }: { content: string; user: { id: number } } = req.body;
  
  const authorId = user.id;

  // Проверка, если требуется наличие файла
  if (!req.file) {
    return res.status(400).json({ error: "Image file is required." });
  }

  const imageUrl: string | undefined = `/uploads/${req.file.filename}`;

  try {
    const newPost = await prisma.post.create({
      data: {
        content,
        authorId,
        imageUrl, // imageUrl может быть `undefined`, что допустимо
      },
    });
    return res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while creating the post." });
  }
};

// Update an existing post
const updatePost = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;
  const { content }: { content: string } = req.body;
  const imageUrl: string | undefined = req.file
    ? `/uploads/${req.file.filename}`
    : undefined;

  // Проверка, если требуется наличие файла
  if (!req.file && !content) {
    return res.status(400).json({ error: "Image file or content is required." });
  }

  try {
    const updatedPost = await prisma.post.update({
      where: { id: parseInt(id, 10) },
      data: {
        content,
        imageUrl: imageUrl !== undefined ? imageUrl : undefined,
      },
    });
    return res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    if ((error as { code?: string }).code === "P2025") {
      // Record not found
      return res.status(404).json({ error: "Post not found." });
    } else {
      return res
        .status(500)
        .json({ error: "An error occurred while updating the post." });
    }
  }
};

// Delete a post
const deletePost = async (req: Request, res: Response): Promise<Response> => {
  const { id } = req.params;

  try {
    await prisma.post.delete({
      where: { id: parseInt(id, 10) },
    });
    return res.status(204).send(); // No content
  } catch (error) {
    console.error("Error deleting post:", error);
    if ((error as { code?: string }).code === "P2025") {
      // Record not found
      return res.status(404).json({ error: "Post not found." });
    } else {
      return res
        .status(500)
        .json({ error: "An error occurred while deleting the post." });
    }
  }
};

export default { createPost, updatePost, deletePost };
