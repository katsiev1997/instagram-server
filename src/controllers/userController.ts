import { Request, Response } from "express";
import prisma from "../models/prismaClient"; // Убедитесь, что путь к вашему prismaClient корректный

export const getUserProfile = async (
  req: Request,
  res: Response
): Promise<Response> => {
  // Определение типа для userId из параметров запроса
  const { username } = req.params;

  try {
    // Поиск пользователя в базе данных
    const user = await prisma.user.findUnique({
      where: { username },
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

    const { password, ...userData } = user;
    // Возвращаем данные пользователя
    return res.json(userData);
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    return res.status(500).json({ error: "Failed to fetch user profile" });
  }
};

export const findUsers = async (req: Request, res: Response): Promise<Response> => {
  // Определение типа для username из параметров запроса
  const { username } = req.params;

  try {
    // Поиск пользователя в базе данных
    const users = await prisma.user.findMany({
      where: {
        username: {
          startsWith: username,
          mode: "insensitive", // Опционально: для поиска без учета регистра
        },
      },
    });
    // Проверка на существование пользователя
    if (!users) {
      return res.status(404).json({ error: "Users not found" });
    }

    const data = users.map((user) => {
      const { password, ...userData } = user;
      return userData;
    });

    // Возвращаем данные пользователя
    return res.json(data);
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    return res.status(500).json({ error: "Failed to fetch user profile" });
  }
};
