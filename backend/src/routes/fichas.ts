import { Router, Request, Response } from 'express';
import db from '../db'; // Ajusta esto si tu db.ts está en otra carpeta
import { upload } from '../middlewares/upload';

const router = Router();

// OBTENER todas las fichas
router.get('/', async (req: Request, res: Response) => {
    try {
        const [rows] = await db.query('SELECT * FROM FICHAS_BUSQUEDA');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener fichas', error });
    }
});

// CREAR una nueva ficha de búsqueda
router.post('/', upload.single('foto'), async (req: Request, res: Response) => {
    try {
        const {
            usuario_id, nombre, edad, genero, fecha_desaparicion,
            lugarEstado, lugarMunicipio, ultUbiEstado, ultUbiMunicipio,
            vestimenta, estatura_m, complexion, cara, color_de_piel,
            cabello, ojos, nariz, boca, labios, senas_particulares,
            correo_electronico, numero, estatus
        } = req.body;

        const fotografia_url = req.file ? `http://localhost:3001/uploads/${req.file.filename}` : '/logo.png';

        const [resultado]: any = await db.query(
            `INSERT INTO FICHAS_BUSQUEDA (
                usuario_id, nombre, edad, genero, fotografia_url, fecha_desaparicion,
                lugarEstado, lugarMunicipio, ultUbiEstado, ultUbiMunicipio,
                vestimenta, estatura_m, complexion, cara, color_de_piel,
                cabello, ojos, nariz, boca, labios, senas_particulares,
                correo_electronico, numero, estatus
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                usuario_id, nombre, edad, genero, fotografia_url, fecha_desaparicion,
                lugarEstado, lugarMunicipio, ultUbiEstado, ultUbiMunicipio,
                vestimenta, estatura_m, complexion, cara, color_de_piel,
                cabello, ojos, nariz, boca, labios, senas_particulares,
                correo_electronico, numero, estatus || 'desaparecido' 
            ]
        );

        res.status(201).json({ mensaje: 'Ficha publicada exitosamente', id: resultado.insertId });
    } catch (error) {
        console.error("Error al guardar ficha:", error);
        res.status(500).json({ mensaje: 'Error al crear la ficha', error });
    }
});

// ACTUALIZAR el estatus de una ficha a 'encontrada'
router.put('/:id/estatus', async (req: Request, res: Response): Promise<any> => {
    try {
        const fichaId = req.params.id;
        const { usuario_id } = req.body;

        const [resultado]: any = await db.query(
            `UPDATE FICHAS_BUSQUEDA 
             SET estatus = 'encontrada' 
             WHERE id = ? AND usuario_id = ?`,
            [fichaId, usuario_id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(403).json({ mensaje: 'No tienes permiso para editar esta ficha o ya fue modificada.' });
        }

        res.status(200).json({ mensaje: 'Estatus actualizado correctamente a encontrada' });
    } catch (error) {
        console.error("Error al actualizar estatus:", error);
        res.status(500).json({ mensaje: 'Error interno al actualizar', error });
    }
});

export default router;