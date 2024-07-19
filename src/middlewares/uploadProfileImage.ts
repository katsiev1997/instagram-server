// import { Request, Response } from "express";
// import prisma from "../models/prismaClient"; // Убедитесь, что путь к вашему prismaClient корректный

// // Middleware для загрузки изображений профиля
// import multer from "multer";
// import path from "path";

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/profile_images/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// // Фильтрация типов файлов
// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image/")) {
//     cb(null, true);
//   } else {
//     cb(new Error("Invalid file type. Only images are allowed."), false);
//   }
// };
// export const uploadProfileImage = multer({ storage, fileFilter }).single(
//   "profileImage"
// );

// // Обновление информации о пользователе
// const updateUserProfile = async (req: Request, res: Response): Promise<Response> => {
//   const { userId } = req.params;
//   const { username, email }: { username?: string; email?: string } = req.body;

//   // Проверка, если файл загружен
//   const profileImageUrl: string | undefined = req.file
//     ? `/uploads/profile_images/${req.file.filename}`
//     : undefined;

//   try {
//     const updatedUser = await prisma.user.update({
//       where: { id: parseInt(userId, 10) },
//       data: {
//         username,
//         email,
//         profileImageUrl, // Обновление пути к изображению профиля
//       },
//     });

//     return res.status(200).json(updatedUser);
//   } catch (error) {
//     console.error("Error updating user profile:", error);
//     if ((error as { code?: string }).code === "P2025") {
//       // Запись не найдена
//       return res.status(404).json({ error: "User not found." });
//     } else {
//       return res
//         .status(500)
//         .json({ error: "An error occurred while updating the user profile." });
//     }
//   }
// };

// export default { updateUserProfile };
