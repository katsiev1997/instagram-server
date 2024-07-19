// src/types/express.d.ts

import { Request } from "express";
import { Multer } from "multer";

// Расширение интерфейса Request для добавления свойства file
declare global {
  namespace Express {
    interface Request {
      file?: Express.Multer.File;
      //files?: Express.Multer.File[]; // если вы используете массив файлов
    }
  }
}
