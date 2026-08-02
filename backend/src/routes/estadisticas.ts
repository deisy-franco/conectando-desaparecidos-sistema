import { Router, Request, Response } from 'express';
import db from '../db';

const router = Router();

// OBTENER todas las estadísticas de un solo golpe
router.get('/', async (req: Request, res: Response) => {
    try {
        // Métricas para las Tarjetas
        const [[{ totalFichas }]]: any = await db.query('SELECT COUNT(*) as totalFichas FROM FICHAS_BUSQUEDA');
        const [[{ totalHallazgos }]]: any = await db.query('SELECT COUNT(*) as totalHallazgos FROM HALLAZGOS'); 
        const [[{ totalReportes }]]: any = await db.query('SELECT COUNT(*) as totalReportes FROM REPORTES'); 
        const [[{ totalUsuarios }]]: any = await db.query('SELECT COUNT(*) as totalUsuarios FROM USUARIOS'); 

        // Datos para Gráfica de Dona
        const [estatusData] = await db.query('SELECT estatus as name, COUNT(*) as value FROM FICHAS_BUSQUEDA GROUP BY estatus');

        // Datos para Gráfica de Barras (Top 5 Municipios)
        const [zonasData] = await db.query('SELECT lugarMunicipio as name, COUNT(*) as cantidad FROM FICHAS_BUSQUEDA WHERE lugarMunicipio != "" AND lugarMunicipio IS NOT NULL GROUP BY lugarMunicipio ORDER BY cantidad DESC LIMIT 5');

        // Datos para Gráfica de Líneas (Tendencia por Mes)
        const [mesesData] = await db.query(`
            SELECT DATE_FORMAT(fecha_desaparicion, '%M') as mes, COUNT(*) as cantidad 
            FROM FICHAS_BUSQUEDA 
            WHERE fecha_desaparicion IS NOT NULL 
            GROUP BY mes, MONTH(fecha_desaparicion) 
            ORDER BY MONTH(fecha_desaparicion)
        `);

        res.json({
            tarjetas: { totalFichas, totalHallazgos, totalReportes, totalUsuarios },
            graficaEstatus: estatusData,
            graficaZonas: zonasData,
            graficaMeses: mesesData
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error al obtener estadísticas', error });
    }
});

export default router;