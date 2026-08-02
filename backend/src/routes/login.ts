import { Router, Request, Response } from 'express';
import db from '../db';

const router = Router();

// Endpoint de LOGIN
// eslint-disable-next-line @typescript-eslint/no-explicit-any
router.post('/', async (req: Request, res: Response): Promise<any> => {
    const { correo_electronico, password } = req.body;

    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const [rows]: any = await db.query(
            'SELECT * FROM USUARIOS WHERE correo_electronico = ? AND password = ?',
            [correo_electronico, password]
        );

        if (rows.length > 0) {
            const usuarioEncontrado = rows[0];
            return res.status(200).json({
                id: usuarioEncontrado.id,
                nombre: usuarioEncontrado.nombre,
                rol: usuarioEncontrado.rol
            });
        } else {
            return res.status(401).json({ mensaje: "Correo o contraseña incorrectos" });
        }

    } catch (error) {
        console.error("Error al buscar usuario:", error);
        return res.status(500).json({ mensaje: "Error interno del servidor" });
    }
});

export default router;