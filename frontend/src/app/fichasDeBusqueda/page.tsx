'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Tarjeta from '../components/Tarjeta';

interface FichaBD {
    usuario_id:number;
    id: number;
    nombre: string;
    edad: number;
    genero: string;
    fotografia_url: string | null;
    fecha_desaparicion: string | null;
    vestimenta: string | null;
    estatura_m: number | null;
    complexion: string | null;
    cara: string | null;
    color_de_piel: string | null;
    cabello: string | null;
    ojos: string | null;
    nariz: string | null;
    boca: string | null;
    labios: string | null;
    senas_particulares: string | null;
    correo_electronico: string | null;
    numero: string | null;
    lugarEstado: string | null;
    lugarMunicipio: string | null;
    ultUbiEstado: string | null;
    ultUbiMunicipio: string | null;
    estatus: string;
}

export default function Page() {
    const [fichas, setFichas] = useState<FichaBD[]>([]);
    const [cargando, setCargando] = useState<boolean>(true);

    useEffect(() => {
        const obtenerFichas = async () => {
            try {
                const respuesta = await axios.get('http://localhost:3001/api/fichas');
                setFichas(respuesta.data);
            } catch (error) {
                console.error("Error obteniendo las fichas:", error);
            } finally {
                setCargando(false);
            }
        };

        obtenerFichas();
    }, []);

    if (cargando) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
                <h2>Cargando fichas de búsqueda...</h2>
            </div>
        );
    }

    return (
        <div style={{ display:'flex', gap: '2rem', padding: '2rem', flexWrap: 'wrap', justifyContent: 'center', backgroundColor:'#F8fafc' }}>
            {fichas.length === 0 ? (
                <h2>No hay fichas registradas actualmente.</h2>
            ) : (
                fichas.map((ficha) => (
                    <Tarjeta 
                        key={ficha.id} 
                        datos={{
                            id: ficha.id,
                            usuario_id: ficha.usuario_id,
                            nombre: ficha.nombre,
                            edad: ficha.edad,
                            genero: ficha.genero,
                            foto: ficha.fotografia_url || '/logo.png',
                            fecha: ficha.fecha_desaparicion ? ficha.fecha_desaparicion.split('T')[0] : 'No especificada', 
                            vestimenta: ficha.vestimenta || 'No especificada',
                            estatura: ficha.estatura_m || 'No especificada',
                            complexion: ficha.complexion || 'No especificada',
                            cara: ficha.cara || 'No especificada',
                            piel: ficha.color_de_piel || 'No especificada',
                            cabello: ficha.cabello || 'No especificado',
                            ojos: ficha.ojos || 'No especificados',
                            nariz: ficha.nariz || 'No especificada',
                            boca: ficha.boca || 'No especificada',
                            labios: ficha.labios || 'No especificados',
                            detalles: ficha.senas_particulares || 'Ninguna',
                            email: ficha.correo_electronico || 'No proporcionado',
                            tel: ficha.numero || 'No proporcionado',
                            lugarEstado: ficha.lugarEstado || 'Desconocido',
                            lugarMunicipio: ficha.lugarMunicipio || 'Desconocido',
                            ultUbiEstado: ficha.ultUbiEstado || 'Desconocido',
                            ultUbiMunicipio: ficha.ultUbiMunicipio || 'Desconocido',
                            estatus: ficha.estatus || 'Desaparecida'
                        }} 
                    />
                ))
            )}
        </div>
    );
}