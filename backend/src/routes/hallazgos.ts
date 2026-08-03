import { Router, Request, Response } from 'express';
import db from '../db';
import { upload } from '../middlewares/upload';
import { API_PUBLIC_URL } from '../config';

const router = Router();

// OBTENER hallazgos
router.get('/', async (req: Request, res: Response) => {
    try {
        const [rows] = await db.query('SELECT * FROM HALLAZGOS');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener hallazgos', error });
    }
});

// CREAR un nuevo hallazgo
router.post('/', upload.array('fotos', 10), async (req: Request, res: Response) => {
    try {
        const {
            usuario_id,
            tipoDeHallazgo, categoriaHallazgo, descripcion, fecha_hallazgo,
            lugarEstado, lugarMunicipio, latitud, longitud
        } = req.body;

        // Convierte las URLs de las fotos a formato JSON para guardarlas
        let fotos_urls: string[] = [];
        if (req.files && Array.isArray(req.files) && req.files.length > 0) {
            fotos_urls = req.files.map(file => `${API_PUBLIC_URL}/uploads/${file.filename}`);
        }
        const fotos_json = JSON.stringify(fotos_urls);
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const [resultado]: any = await db.query(
            `INSERT INTO HALLAZGOS (
                usuario_id, tipo_de_Hallazgo, categoria, descripcion, fecha_hallazgo,
                ubicacion_Estado, ubicacion_Municipio, ubicacion_Longitud, ubicacion_Latitud, fotografia_url
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                usuario_id || null, 
                tipoDeHallazgo, 
                categoriaHallazgo, 
                descripcion, 
                fecha_hallazgo,
                lugarEstado, 
                lugarMunicipio, 
                parseFloat(longitud),
                parseFloat(latitud),
                fotos_json
            ]
        );

        res.status(201).json({ mensaje: 'Hallazgo publicado exitosamente', id: resultado.insertId });
    } catch (error) {
        console.error("Error al guardar hallazgo:", error);
        res.status(500).json({ mensaje: 'Error al crear el hallazgo', error });
    }
});

export default router;