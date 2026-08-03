'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TarjetaHallazgo from '../components/TarjetaHallazgos';
import { API_URL } from '@/lib/api';

export default function Page(){
    const [hallazgos, setHallazgos] = useState([]);

    useEffect(() => {
        const cargarHallazgos = async () => {
            try {
                const respuesta = await axios.get(`${API_URL}/api/hallazgos`);
                setHallazgos(respuesta.data);
            } catch (error) {
                console.error("Error al obtener los hallazgos:", error);
            }
        };
        cargarHallazgos();
    }, []);

    return(
        <div style={{
            display:'flex', 
            gap: '2rem', 
            padding: '2rem', 
            flexWrap: 'wrap', 
            justifyContent: 'center', 
            alignItems: 'flex-start',
            backgroundColor:'#f8fafc', 
            minHeight: '100vh'
        }}>
            
            {/*eslint-disable-next-line @typescript-eslint/no-explicit-any*/}
            {hallazgos.map((hallazgo: any) => {
                
                let listaFotos = ['/logo.png'];
                if (hallazgo.fotografia_url) {
                    try {
                        const parsed = JSON.parse(hallazgo.fotografia_url);
                        if (Array.isArray(parsed) && parsed.length > 0) {
                            listaFotos = parsed;
                        }
                    } catch (e) {
                        const textoLimpio = hallazgo.fotografia_url.replace(/[\[\]"\\]/g, '');
                        if (textoLimpio) listaFotos = [textoLimpio];
                    }
                }

                let fechaFormateada = 'Sin fecha';
                if (hallazgo.fecha_hallazgo) {
                    const fecha = new Date(hallazgo.fecha_hallazgo);
                    const dia = String(fecha.getUTCDate()).padStart(2, '0');
                    const mes = String(fecha.getUTCMonth() + 1).padStart(2, '0'); 
                    const anio = fecha.getUTCFullYear();
                    fechaFormateada = `${dia}/${mes}/${anio}`;
                }

                const datosAdaptados = {
                    id: hallazgo.id,
                    tipoDeHallazgo: hallazgo.tipo_de_Hallazgo,
                    categoria: hallazgo.categoria, 
                    categoriaHallazgo: hallazgo.categoria, 
                    descripcion: hallazgo.descripcion,
                    fotos: listaFotos,
                    foto: listaFotos[0],
                    lugarEstado: hallazgo.ubicacion_Estado,
                    lugarMunicipio: hallazgo.ubicacion_Municipio,
                    coordenadas: { 
                        lat: parseFloat(hallazgo.ubicacion_Latitud) || 21.8818, 
                        lng: parseFloat(hallazgo.ubicacion_Longitud) || -102.2915 
                    }
                };

                return <TarjetaHallazgo key={hallazgo.id} datos={datosAdaptados} />;
            })}

            {hallazgos.length === 0 && (
                <h2 style={{ color: '#64748b', marginTop: '2rem' }}>No hay hallazgos publicados todavía.</h2>
            )}

        </div>
    );
}