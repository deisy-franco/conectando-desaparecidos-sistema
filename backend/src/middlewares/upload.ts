// src/middlewares/upload.ts
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Crea la carpeta "uploads" si no existe
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    destination: function (_req: any, file: any, cb: any) {
        cb(null, 'uploads/'); 
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filename: function (_req: any, file: any, cb: any) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); 
    }
});

export const upload = multer({ storage: storage });