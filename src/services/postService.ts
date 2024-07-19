import { Post } from "@prisma/client";
import prisma from "../models/prismaClient"

// Типы для параметров функций
interface CreatePostInput {
  imageUrl: string;
  content: string;
  authorId: number;
}

interface UpdatePostInput {
  imageUrl?: string;
  content?: string;
}

// Создание поста
const createPost = async ({
  imageUrl,
  content,
  authorId,
}: CreatePostInput): Promise<Post> => {
  return await prisma.post.create({
    data: {
      imageUrl,
      content,
      authorId,
    },
  });
};

// Обновление поста
const updatePost = async (
  postId: number,
  { imageUrl, content }: UpdatePostInput
): Promise<Post> => {
  return await prisma.post.update({
    where: { id: postId },
    data: {
      imageUrl,
      content,
    },
  });
};

// Удаление поста
const deletePost = async (postId: number): Promise<Post> => {
  return await prisma.post.delete({
    where: { id: postId },
  });
};

export default {
  createPost,
  updatePost,
  deletePost,
};
