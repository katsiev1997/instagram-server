import multer, { StorageEngine, FileFilterCallback, Multer } from "multer";
import path from "path";
import { Request } from "express";

// Настройка хранения файлов
const storage: StorageEngine = {
  _handleFile(
    req: Request,
    file: Express.Multer.File,
    cb: (error: any, info?: any) => void
  ) {
    const uploadPath = path.join(
      "uploads/",
      Date.now() + path.extname(file.originalname)
    );

    file.stream
      .pipe(require("fs").createWriteStream(uploadPath))
      .on("error", (error:any) => cb(error))
      .on("finish", () => cb(null, { path: uploadPath }));
  },

  _removeFile(req: Request, file: Express.Multer.File, cb: (error: any) => void) {
    require("fs").unlink(file.path, cb);
  },
};

// Фильтрация типов файлов
const fileFilter: (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => void = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true); // Допустимый файл
  } else {
    cb(null, false); // Неправильный тип файла
  }
};

export const upload: Multer = multer({
  storage,
  fileFilter,
});
