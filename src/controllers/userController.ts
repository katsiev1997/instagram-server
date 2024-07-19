import { Request, Response } from "express";
import prisma from "../models/prismaClient"; // Убедитесь, что путь к вашему prismaClient корректный

export const getUserProfile = async (
  req: Request,
  res: Response
): Promise<Response> => {
  // Определение типа для userId из параметров запроса
  const { userId } = req.params;

  try {
    // Поиск пользователя в базе данных
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId, 10) },
      include: {
        posts: true,
        comments: true,
        likes: true,
      },
    });

    // Проверка на существование пользователя
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Возвращаем данные пользователя
    return res.json(user);
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    return res.status(500).json({ error: "Failed to fetch user profile" });
  }
};
