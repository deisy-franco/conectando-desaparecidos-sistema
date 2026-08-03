const urlConfigurada =
    process.env.NEXT_PUBLIC_API_URL ??
    'http://localhost:3001';

export const API_URL =
    urlConfigurada.replace(/\/$/, '');