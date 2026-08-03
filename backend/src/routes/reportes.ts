import { Router, Request, Response } from 'express';
import db from '../db';
import { upload } from '../middlewares/upload';
import { API_PUBLIC_URL } from '../config';

const router = Router();

// OBTENER reportes
router.get('/', async (req: Request, res: Response) => {
    try {
        const [rows] = await db.query(`
            SELECT R.*, U.nombre AS nombre_usuario 
            FROM REPORTES R 
            LEFT JOIN USUARIOS U ON R.usuario_id = U.id
        `);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener reportes', error });
    }
});

// CREAR un nuevo reporte
router.post('/', upload.array('fotos', 5), async (req: Request, res: Response) => {
    try {
        const {
            usuario_id,
            tipo_reporte,
            categoria,
            descripcion,
            fecha_reporte,
            ubicacion_Estado,
            ubicacion_Municipio,
            latitud,
            longitud,
            anonimo
        } = req.body;

        let fotos_urls: string[] = [];
        if (req.files && Array.isArray(req.files) && req.files.length > 0) {
            fotos_urls = req.files.map(file => `${API_PUBLIC_URL}/uploads/${file.filename}`);
        }
        const fotos_json = JSON.stringify(fotos_urls);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const [resultado]: any = await db.query(
            `INSERT INTO REPORTES (
                usuario_id, tipo_reporte, categoría, descripcion, 
                ubicacion_Estado, ubicacion_Municipio, ubicacion_Longitud, ubicacion_Latitud, 
                fotografia_url, anonimo, fecha_reporte
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                usuario_id || null, 
                tipo_reporte, 
                categoria, 
                descripcion, 
                ubicacion_Estado, 
                ubicacion_Municipio, 
                longitud || '', 
                latitud || '',  
                fotos_json,
                anonimo === 'true' || anonimo === true ? 1 : 0,
                fecha_reporte || new Date()
            ]
        );

        res.status(201).json({ mensaje: 'Reporte publicado exitosamente', id: resultado.insertId });
    } catch (error) {
        console.error("Error al guardar el reporte:", error);
        res.status(500).json({ mensaje: 'Error al crear el reporte', error });
    }
});

export default router;