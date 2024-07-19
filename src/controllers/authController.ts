import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import prisma from "../models/prismaClient"; // Убедитесь, что путь к вашему prismaClient корректный

interface ErrorWithCode extends Error {
  code?: string;
}

interface JwtPayload {
  id: number;
}

const register = async (req: Request, res: Response): Promise<Response> => {
  const { email, password, username, fullname, profileImageUrl } = req.body;

  if (!email || !password || !username || !fullname) {
    return res
      .status(400)
      .json({ error: "Email, password, username and fullname are required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
        fullname,
        profileImageUrl,
      },
    });

    return res
      .status(201)
      .json({ id: user.id, username: user.username, email: user.email });
  } catch (error) {
    const err = error as ErrorWithCode;
    if (err.code === "P2002") {
      return res.status(400).json({ error: "Email or username already exists" });
    }
    console.log(error);
    return res.status(500).json({ error: "User registration failed" });
  }
};

const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const access_token = createAccessToken({ id: user.id });
    const refresh_token = createRefreshToken({ id: user.id });

    res.cookie("refreshToken", refresh_token, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: "/api/auth/refresh_token",
      httpOnly: true,
    });

    const { password: _password, ...userData } = user;

    return res.status(200).json({
      token: access_token,
      userData,
      message: "Вы успешно авторизовались!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Authentication failed" });
  }
};

const generateAccessToken = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const rf_token = req.cookies.refreshToken;
    if (!rf_token) return res.status(400).json({ message: "Пожалуйста войдите" });

    const decoded = jwt.verify(
      rf_token,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as jwt.JwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }

    const refresh_token = createRefreshToken({ id: user.id });
    res.cookie("refreshToken", refresh_token, {
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: "/api/auth/refresh_token",
      httpOnly: true,
    });

    const access_token = createAccessToken({ id: user.id });
    const { password, ...userData } = user;

    return res.status(200).json({
      token: access_token,
      userData,
      message: "Вы авторизованы",
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching user data" });
  }
};

const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("refreshToken", { path: "/api/auth/refresh_token" });
    return res.status(200).json({ message: "Logged out!" });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return res
      .status(500)
      .json({ message: "Server error" });
  }
};

const createAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: "2h",
  });
};

const createRefreshToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET as string, {
    expiresIn: "30d",
  });
};

const authController = {
  register,
  login,
  generateAccessToken,
  logout,
};

export default authController;
