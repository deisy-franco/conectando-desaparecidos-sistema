import mysql from 'mysql2/promise';

const db = mysql.createPool({
    host: 'localhost',
    user: 'conectandoDesaparecidos', 
    password: 'equipoTlacuaches', 
    database: 'conectando_desaparecidos',
    port: 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default db;