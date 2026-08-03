// src/app.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
//import path from 'path';

// Importamos todas tus rutas separadas
import usuariosRoutes from './routes/usuarios';
import fichasRoutes from './routes/fichas';
import hallazgosRoutes from './routes/hallazgos';
import reportesRoutes from './routes/reportes';
import estadisticasRoutes from './routes/estadisticas';

const app = express();

// Middlewares globales
app.use(cors()); 
app.use(express.json());

// Expone la carpeta uploads para que el navegador pueda ver las fotos
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok', mensaje: 'Backend funcionando' });
});
// Conectamos los Endpoints (Nota cómo quitamos el '/api/fichas' de los archivos individuales porque aquí se define la base)
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/login', usuariosRoutes); // Puedes meter el login dentro del archivo de usuarios
app.use('/api/fichas', fichasRoutes);
app.use('/api/hallazgos', hallazgosRoutes);
app.use('/api/reportes', reportesRoutes);
app.use('/api/estadisticas', estadisticasRoutes);


export default app;