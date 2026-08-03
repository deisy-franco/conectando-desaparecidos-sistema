'use client'
import axios from 'axios';
import React, { useState } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { API_URL } from '@/lib/api';

export default function AuthPage() {
    
    const router = useRouter();
    const { iniciarSesion } = useAuth();
    const [vistaActual, setVistaActual] = useState<'login' | 'registro'>('login');
    const [loginDatos, setLoginDatos] = useState({ correo: '', contrasena: '' });
    const [registroDatos, setRegistroDatos] = useState({ nombre: '', correo: '', contrasena: '' });
    const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLoginDatos({ ...loginDatos, [e.target.name]: e.target.value });
    };

    const handleRegistroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRegistroDatos({ ...registroDatos, [e.target.name]: e.target.value });
    };

    const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const respuesta = await axios.post(`${API_URL}/api/login`, {
                correo_electronico: loginDatos.correo,
                password: loginDatos.contrasena
            });

            iniciarSesion(respuesta.data);
            
            alert("¡Inicio de sesión exitoso!");
            router.push('/');
            
        } catch (error) {
            console.error("Error al intentar iniciar sesión:", error);
            alert("Correo o contraseña incorrectos."); 
        }
    };

    const handleRegistroSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const nuevoUsuarioDB = {
            rol: 'ciudadano', 
            nombre: registroDatos.nombre,
            correo_electronico: registroDatos.correo,
            password: registroDatos.contrasena 
        };

        try {
            const respuesta = await axios.post(`${API_URL}/api/usuarios`, nuevoUsuarioDB);
            alert("¡Usuario guardado en la base de datos real!");

            setRegistroDatos({ nombre: '', correo: '', contrasena: '' });
            setVistaActual('login');
        } catch (error) {
            console.error("Hubo un error al guardar en la BD:", error);
            alert("Error al conectar con la base de datos.");
        }
    };

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#64748B', padding: '2rem' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '420px', backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '3rem 2rem 2.5rem 2rem', boxShadow: '0 10px 25px rgba(0,0,0,0.15)' }}>
                
                <Button onClick={() => router.push('/')} startIcon={<ArrowBackIcon />} style={{ position: 'absolute', top: '1.2rem', left: '1rem', color: '#64748b', textTransform: 'none', fontWeight: 'bold', fontSize: '0.9rem' }}>
                    Volver
                </Button>

                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem', marginTop: '0.5rem' }}>
                    <AccountCircleIcon style={{ fontSize: '110px', color: '#94a3b8' }} />
                </div>

                {vistaActual === 'login' ? (
                    <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <label style={{ fontWeight: '600', color: '#334155', fontSize: '0.9rem' }}>Correo electrónico</label>
                            <input type="email" name="correo" value={loginDatos.correo} onChange={handleLoginChange} required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <label style={{ fontWeight: '600', color: '#334155', fontSize: '0.9rem' }}>Contraseña</label>
                            <input type="password" name="contrasena" value={loginDatos.contrasena} onChange={handleLoginChange} required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                            <Button type="submit" variant="contained" style={{ backgroundColor: '#0f172a', color: 'white', width: '100%', padding: '0.8rem', borderRadius: '8px', textTransform: 'none', fontSize: '1rem', fontWeight: 'bold' }}>
                                Iniciar sesión
                            </Button>
                            <Button variant="text" onClick={() => setVistaActual('registro')} style={{ color: '#64748b', textTransform: 'none', fontWeight: '600' }}>
                                Registrarse
                            </Button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleRegistroSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <label style={{ fontWeight: '600', color: '#334155', fontSize: '0.9rem' }}>Nombre</label>
                            <input type="text" name="nombre" value={registroDatos.nombre} onChange={handleRegistroChange} required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <label style={{ fontWeight: '600', color: '#334155', fontSize: '0.9rem' }}>Correo electrónico</label>
                            <input type="email" name="correo" value={registroDatos.correo} onChange={handleRegistroChange} required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            <label style={{ fontWeight: '600', color: '#334155', fontSize: '0.9rem' }}>Contraseña</label>
                            <input type="password" name="contrasena" value={registroDatos.contrasena} onChange={handleRegistroChange} required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                            <Button type="submit" variant="contained" style={{ backgroundColor: '#0f172a', color: 'white', width: '100%', padding: '0.8rem', borderRadius: '8px', textTransform: 'none', fontSize: '1rem', fontWeight: 'bold' }}>
                                Crear cuenta
                            </Button>
                            <Button variant="text" onClick={() => setVistaActual('login')} style={{ color: '#64748b', textTransform: 'none', fontWeight: '600' }}>
                                ¿Ya tienes cuenta? Inicia sesión
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}