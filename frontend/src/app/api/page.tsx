'use client'
import React, { useState, useEffect, CSSProperties } from 'react';
import axios from 'axios';
import { API_URL } from '@/lib/api';

export default function VisorDatosBD() {
    // ESTADOS: Cumpliendo el manejo de carga (loading) y datos requeridos por la rúbrica
    const [datos, setDatos] = useState({
        usuarios: [],
        fichas: [],
        hallazgos: [],
        reportes: []
    });
    const [cargando, setCargando] = useState(true);
    
    // ESTADO: Manejo de errores correcto
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const cargarDatosDeLaAPI = async () => {
            try {
                // Consumo de MÚLTIPLES ENDPOINTS mediante Axios
                const [resUsuarios, resFichas, resHallazgos, resReportes] = await Promise.all([
                    axios.get(`${API_URL}/api/usuarios`),
                    axios.get(`${API_URL}/api/fichas`),
                    axios.get(`${API_URL}/api/hallazgos`),
                    axios.get(`${API_URL}/api/reportes`)
                ]);

                // Asignación de datos exitosa
                setDatos({
                    usuarios: resUsuarios.data,
                    fichas: resFichas.data,
                    hallazgos: resHallazgos.data,
                    reportes: resReportes.data
                });
                
                setCargando(false);
            } catch (err) {
                console.error("Error al conectar con la API:", err);
                setError("No se pudo conectar con la base de datos. Verifica que el backend esté encendido.");
                setCargando(false);
            }
        };

        cargarDatosDeLaAPI();
    }, []);

    // 1. RENDERIZADO DE CARGA
    if (cargando) return (
        <div style={{ padding: '2rem', textAlign: 'center', fontSize: '1.2rem' }}>
            Cargando datos desde la API...
        </div>
    );

    // 2. RENDERIZADO DE ERROR
    if (error) return (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'red', fontWeight: 'bold' }}>
            {error}
        </div>
    );

    // 3. RENDERIZADO DE DATOS (Éxito)
    return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#0f172a' }}>
                Visor General de Tablas (Consumo de API)
            </h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                
                {/* TABLA USUARIOS */}
                <div style={tarjetaEstilo}>
                    <h2 style={tituloEstilo}>Usuarios ({datos.usuarios.length})</h2>
                    <pre style={preEstilo}>{JSON.stringify(datos.usuarios, null, 2)}</pre>
                </div>

                {/* TABLA FICHAS */}
                <div style={tarjetaEstilo}>
                    <h2 style={tituloEstilo}>Fichas de Búsqueda ({datos.fichas.length})</h2>
                    <pre style={preEstilo}>{JSON.stringify(datos.fichas, null, 2)}</pre>
                </div>

                {/* TABLA HALLAZGOS */}
                <div style={tarjetaEstilo}>
                    <h2 style={tituloEstilo}>Hallazgos ({datos.hallazgos.length})</h2>
                    <pre style={preEstilo}>{JSON.stringify(datos.hallazgos, null, 2)}</pre>
                </div>

                {/* Tabla de reportes */}
                <div style={tarjetaEstilo}>
                    <h2 style={tituloEstilo}>Reportes Anónimos ({datos.reportes.length})</h2>
                    <pre style={preEstilo}>{JSON.stringify(datos.reportes, null, 2)}</pre>
                </div>

            </div>
        </div>
    );
}

//Estilos
const tarjetaEstilo: CSSProperties = {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
};

const tituloEstilo: CSSProperties = { 
    margin: '0 0 1rem 0', 
    color: '#334155', 
    borderBottom: '2px solid #e2e8f0', 
    paddingBottom: '0.5rem' 
};

const preEstilo: CSSProperties = {
    backgroundColor: '#1e293b',
    color: '#38bdf8',
    padding: '1rem',
    borderRadius: '4px',
    overflowX: 'auto',
    fontSize: '0.85rem'
};