'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TarjetaReporte from '../components/TarjetaReporte'; 

export default function ReportesPage() {
    const [reportes, setReportes] = useState([]);

    useEffect(() => {
        const cargarReportes = async () => {
            try {
                const respuesta = await axios.get('http://localhost:3001/api/reportes');
                setReportes(respuesta.data);
            } catch (error) {
                console.error("Error al obtener los reportes:", error);
            }
        };
        cargarReportes();
    }, []);

    return (
        <div style={{
            display: 'flex',
            gap: '2rem',
            padding: '2rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'flex-start',
            backgroundColor: '#f8fafc',
            minHeight: '100vh'
        }}>

            {/*eslint-disable-next-line @typescript-eslint/no-explicit-any*/}
            {reportes.map((reporte: any) => {
                
                let listaFotos = ['/logo.png'];
                if (reporte.fotografia_url) {
                    try {
                        const parsed = JSON.parse(reporte.fotografia_url);
                        if (Array.isArray(parsed) && parsed.length > 0) {
                            listaFotos = parsed;
                        }
                    } catch (e) {
                        const textoLimpio = reporte.fotografia_url.replace(/[\[\]"\\]/g, '');
                        if (textoLimpio) listaFotos = [textoLimpio];
                    }
                }

                let fechaFormateada = 'Sin fecha';
                if (reporte.fecha_reporte) {
                    const fecha = new Date(reporte.fecha_reporte);
                    const dia = String(fecha.getUTCDate()).padStart(2, '0');
                    const mes = String(fecha.getUTCMonth() + 1).padStart(2, '0');
                    const anio = fecha.getUTCFullYear();
                    fechaFormateada = `${dia}/${mes}/${anio}`;
                }

                const esAnonimo = reporte.anonimo === 1 || reporte.anonimo === true;
                const autor = esAnonimo ? 'Anónimo' : (reporte.nombre_usuario || 'Usuario Desconocido');

                const datosAdaptados = {
                    id: reporte.id,
                    tipoDeReporte: reporte.tipo_reporte,
                    categoriaReporte: reporte.categoría, 
                    descripcion: reporte.descripcion,
                    fecha: fechaFormateada,
                    anonimo: reporte.anonimo === 1 || reporte.anonimo === true, 

                    nombreUsuario: autor,
                    
                    fotos: listaFotos,
                    foto: listaFotos[0], 
                    
                    lugarEstado: reporte.ubicacion_Estado,
                    lugarMunicipio: reporte.ubicacion_Municipio,
                    coordenadas: { 
                        lat: parseFloat(reporte.ubicacion_Latitud) || 21.8818, 
                        lng: parseFloat(reporte.ubicacion_Longitud) || -102.2915 
                    }
                };

                return <TarjetaReporte key={reporte.id} datos={datosAdaptados} />;
            })}

            {reportes.length === 0 && (
                <h2 style={{ color: '#64748b', marginTop: '2rem' }}>No hay reportes publicados todavía.</h2>
            )}
        </div>
    );
}