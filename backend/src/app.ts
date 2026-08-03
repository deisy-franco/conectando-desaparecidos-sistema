import cors from 'cors';
import express, {
    Request,
    Response,
} from 'express';

import {
    FRONTEND_URL,
    UPLOAD_DIR,
} from './config';

import db from './db';

import estadisticasRoutes from './routes/estadisticas';
import fichasRoutes from './routes/fichas';
import hallazgosRoutes from './routes/hallazgos';
import loginRoutes from './routes/login';
import reportesRoutes from './routes/reportes';
import usuariosRoutes from './routes/usuarios';

const app = express();

app.disable('x-powered-by');

app.use(
    cors({
        origin: FRONTEND_URL,
        credentials: true,
    })
);

app.use(
    express.json({
        limit: '10mb',
    })
);

app.use(
    '/uploads',
    express.static(UPLOAD_DIR)
);

/*
 * Comprueba únicamente que el servidor Express esté funcionando.
 */
app.get(
    '/api/health',
    (_request: Request, response: Response) => {
        response.status(200).json({
            status: 'ok',
            mensaje: 'Backend funcionando',
        });
    }
);

/*
 * Comprueba que el backend pueda conectarse a MySQL.
 * Esta es la ruta nueva que debes agregar.
 */
app.get(
    '/api/health/db',
    async (_request: Request, response: Response) => {
        try {
            await db.query('SELECT 1 AS conexion');

            response.status(200).json({
                status: 'ok',
                mensaje: 'Conexión con MySQL funcionando',
            });
        } catch (error) {
            console.error(
                'Error al comprobar MySQL:',
                error
            );

            response.status(500).json({
                status: 'error',
                mensaje: 'No fue posible conectar con MySQL',
            });
        }
    }
);

/*
 * Comprueba que el backend pueda conectarse a MySQL.
 */
app.get(
    '/api/health/db',
    async (_request: Request, response: Response) => {
        try {
            await db.query('SELECT 1 AS conexion');

            response.status(200).json({
                status: 'ok',
                mensaje: 'Conexión con MySQL funcionando',
            });
        } catch (error) {
            console.error('Error al comprobar MySQL:', error);

            response.status(500).json({
                status: 'error',
                mensaje: 'No fue posible conectar con MySQL',
            });
        }
    }
);

/*
 * Rutas principales de la aplicación.
 */
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/fichas', fichasRoutes);
app.use('/api/hallazgos', hallazgosRoutes);
app.use('/api/reportes', reportesRoutes);
app.use('/api/estadisticas', estadisticasRoutes);

app.use(
    (_request: Request, response: Response) => {
        response.status(404).json({
            mensaje: 'Ruta no encontrada',
        });
    }
);

export default app;