import path from 'path';

export const FRONTEND_URL =
    process.env.FRONTEND_URL ?? 'http://localhost:3000';

export const API_PUBLIC_URL = (
    process.env.API_PUBLIC_URL ?? 'http://localhost:3001'
).replace(/\/$/, '');

export const UPLOAD_DIR =
    process.env.UPLOAD_DIR ??
    path.join(process.cwd(), 'uploads');