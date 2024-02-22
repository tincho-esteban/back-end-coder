import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(process.cwd(), "public", "img"));
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const uploader = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image")) {
            cb(null, true);
        } else {
            cb(new Error("El archivo no es una imagen"));
        }
    },
    onError: (err, next) => {
        next(err);
    },
});

export default uploader;
