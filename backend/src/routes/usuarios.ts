import { Router, Request, Response } from 'express';
import db from '../db';

const router = Router();

// OBTENER usuarios
router.get('/', async (req: Request, res: Response) => {
    try {
        const [rows] = await db.query('SELECT id, rol, nombre, correo_electronico FROM USUARIOS');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener usuarios', error });
    }
});

// CREAR un nuevo usuario
router.post('/', async (req: Request, res: Response) => {
    try {
        const { rol, nombre, correo_electronico, password } = req.body;
        
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const [resultado]: any = await db.query(
            'INSERT INTO USUARIOS (rol, nombre, correo_electronico, password) VALUES (?, ?, ?, ?)',
            [rol, nombre, correo_electronico, password]
        );

        res.status(201).json({ 
            mensaje: 'Usuario creado exitosamente', 
            id: resultado.insertId 
        });
    } catch (error) {
        console.error("Error al guardar usuario:", error);
        res.status(500).json({ mensaje: 'Error al crear usuario', error });
    }
});

export default router;