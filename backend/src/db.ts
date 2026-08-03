import mysql from 'mysql2/promise';

function obtenerVariableObligatoria(nombre: string): string {
    const valor = process.env[nombre];

    if (!valor) {
        throw new Error(
            `Falta configurar la variable de entorno ${nombre}`
        );
    }

    return valor;
}

const usarSsl = process.env.DB_SSL === 'true';

const db = mysql.createPool({
    host: obtenerVariableObligatoria('DB_HOST'),
    port: Number(process.env.DB_PORT ?? 3306),
    user: obtenerVariableObligatoria('DB_USER'),
    password: obtenerVariableObligatoria('DB_PASSWORD'),
    database: obtenerVariableObligatoria('DB_NAME'),

    ssl: usarSsl
        ? {
            rejectUnauthorized: true,
        }
        : undefined,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export default db;