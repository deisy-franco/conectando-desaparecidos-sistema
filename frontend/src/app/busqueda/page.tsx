'use client'
import React, { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import Tarjeta from '../components/Tarjeta'; 
import TarjetaReporte from '../components/TarjetaReporte'; 
import TarjetaHallazgo from '../components/TarjetaHallazgos';
import {ubicacionesMexico} from '../components/ubicaciones';
import { API_URL } from '@/lib/api';

const datosUbicacion: Record<string, string[]> = ubicacionesMexico;

export default function Page() {
    //Estados iniciales de los Filtros
    const [estado, setEstado] = useState('');
    const [municipio, setMunicipio] = useState('');
    const [tipoBusqueda, setTipoBusqueda] = useState('todos');
    const [fecha, setFecha] = useState('');

    //Estados para guardar los resultados
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [resultadosFichas, setResultadosFichas] = useState<any[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [resultadosHallazgos, setResultadosHallazgos] = useState<any[]>([]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [resultadosReportes, setResultadosReportes] = useState<any[]>([]);
    const [busquedaRealizada, setBusquedaRealizada] = useState(false);

    //Para resetear los municipios cuando se cambie de estado
    const handleEstadoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setEstado(e.target.value);
        setMunicipio('');
    };

    //Función para ejecutar la búsqueda
    const ejecutarBusqueda = async () => {
        setBusquedaRealizada(true);
        try {
            const [resFichas, resHallazgos, resReportes] = await Promise.all([
                axios.get(`${API_URL}/api/fichas`).catch(() => ({ data: [] })),
                axios.get(`${API_URL}/api/hallazgos`).catch(() => ({ data: [] })),
                axios.get(`${API_URL}/api/reportes`).catch(() => ({ data: [] }))
            ]);

            let fichasBD = resFichas.data || [];
            let hallazgosBD = resHallazgos.data || [];
            let reportesBD = resReportes.data || [];

            //Filtro por estado
            if (estado) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                fichasBD = fichasBD.filter((f: any) => f.lugarEstado === estado);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                hallazgosBD = hallazgosBD.filter((h: any) => h.ubicacion_Estado === estado || h.lugarEstado === estado);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                reportesBD = reportesBD.filter((r: any) => r.ubicacion_Estado === estado || r.lugarEstado === estado);
            }

            //Filtro por municipio
            if (municipio) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                fichasBD = fichasBD.filter((f: any) => f.lugarMunicipio === municipio);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                hallazgosBD = hallazgosBD.filter((h: any) => h.ubicacion_Municipio === municipio || h.lugarMunicipio === municipio);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                reportesBD = reportesBD.filter((r: any) => r.ubicacion_Municipio === municipio || r.lugarMunicipio === municipio);
            }

            //Filtro por fecha
            if (fecha) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                fichasBD = fichasBD.filter((f: any) => f.fecha_desaparicion && f.fecha_desaparicion.includes(fecha));
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                hallazgosBD = hallazgosBD.filter((h: any) => h.fecha && h.fecha.includes(fecha));
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                reportesBD = reportesBD.filter((r: any) => r.fecha && r.fecha.includes(fecha));
            }

            setResultadosFichas(fichasBD);
            setResultadosHallazgos(hallazgosBD);
            setResultadosReportes(reportesBD);

        } catch (error) {
            console.error("Error al conectar con la base de datos:", error);
            alert("Hubo un problema al realizar la búsqueda.");
        }
    };

    const inputStyle = {
        padding: '10px 15px',
        borderRadius: '20px',
        border: '1px solid #cbd5e1',
        outline: 'none',
        fontSize: '1rem',
        color: '#334155',
        backgroundColor: 'white',
        minWidth: '200px',
        flex: '1'
    };

    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '2rem 4rem' }}>
            
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ color: '#d97777', fontSize: '2rem', marginBottom: '2rem' }}>
                    Utiliza los filtros para encontrar la información que buscas
                </h1>

                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }}>
                    
                    <select style={inputStyle} value={estado} onChange={handleEstadoChange}>
                        <option value="">Estado de desaparición</option>
                        {Object.keys(datosUbicacion).map((est) => (
                            <option key={est} value={est}>{est}</option>
                        ))}
                    </select>

                    <select 
                        style={{...inputStyle, opacity: estado ? 1 : 0.6, cursor: estado ? 'pointer' : 'not-allowed'}} 
                        value={municipio} 
                        onChange={(e) => setMunicipio(e.target.value)}
                        disabled={!estado} 
                    >
                        <option value="">Municipio de desaparición</option>
                        {estado && datosUbicacion[estado]?.map((mun) => (
                            <option key={mun} value={mun}>{mun}</option>
                        ))}
                    </select>

                    <select style={inputStyle} value={tipoBusqueda} onChange={(e) => setTipoBusqueda(e.target.value)}>
                        <option value="todos">Mostrar Todo</option>
                        <option value="fichas">Fichas de búsqueda</option>
                        <option value="hallazgos">Hallazgos</option>
                        <option value="reportes">Reportes</option>
                    </select>

                    <input type="date" style={inputStyle} value={fecha} onChange={(e) => setFecha(e.target.value)} />

                    <button 
                        onClick={ejecutarBusqueda}
                        style={{
                            backgroundColor: '#7b1113', 
                            color: 'white',
                            border: 'none',
                            borderRadius: '50%',
                            width: '45px',
                            height: '45px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 4px 6px rgba(123, 17, 19, 0.3)'
                        }}
                    >
                        <SearchIcon />
                    </button>
                </div>
            </div>

            {/*Resultados*/}
            {busquedaRealizada && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                    
                    {/* Fichas de busqueda*/}
                    {(tipoBusqueda === 'todos' || tipoBusqueda === 'fichas') && (
                        <section>
                            <h2 style={{ fontSize: '1.5rem', color: '#0f172a', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
                                Resultados de personas
                            </h2>
                            <div style={{ display: 'flex', flexWrap: 'nowrap',  gap: '2rem', overflowX: 'auto', overflowY: 'hidden', paddingBottom: '15px', width: '100%' }}>
                                {resultadosFichas.length > 0 ? (
                                    resultadosFichas.map((ficha) => (
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
                                ) : (
                                    <p style={{ color: '#64748b' }}>No se encontraron personas con estos filtros.</p>
                                )}
                            </div>
                        </section>
                    )}

                    {/*Hallazgos*/}
                    {(tipoBusqueda === 'todos' || tipoBusqueda === 'hallazgos') && (
                        <section>
                            <h2 style={{ fontSize: '1.5rem', color: '#0f172a', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
                                Resultados de hallazgos
                            </h2>
                            <div style={{ display: 'flex',  flexWrap: 'nowrap', gap: '2rem', overflowX: 'auto', overflowY: 'hidden', paddingBottom: '15px', width: '100%' }}>
                                
                                {resultadosHallazgos.length > 0 ? (
                                    resultadosHallazgos.map((hallazgo) => {
                                        let arregloFotos = [];
                                        try {
                                            arregloFotos = hallazgo.fotografia_url 
                                                            ? JSON.parse(hallazgo.fotografia_url) 
                                                            : ['/logo.png'];
                                        } catch (error) {
                                            arregloFotos = [hallazgo.fotografia_url || '/logo.png'];
                                        }
                                        return (
                                            <TarjetaHallazgo 
                                                key={hallazgo.id} 
                                                datos={{
                                                    ...hallazgo, 
                                                    id: hallazgo.id,
                                                    fotos: arregloFotos,
                                                    tipoDeHallazgo: hallazgo.tipo_de_Hallazgo || hallazgo.categoria || 'Hallazgo reportado',
                                                    categoriaHallazgo: hallazgo.categoria,
                                                    fecha: hallazgo.fecha_hallazgo || hallazgo.fecha ? (hallazgo.fecha_hallazgo || hallazgo.fecha).split('T')[0] : 'Sin fecha',
                                                    lugarEstado: hallazgo.ubicacion_Estado || hallazgo.estado || hallazgo.lugarEstado || 'Desconocido',
                                                    lugarMunicipio: hallazgo.ubicacion_Municipio || hallazgo.municipio || hallazgo.lugarMunicipio || 'Desconocido',
                                                    coordenadas: { 
                                                        lat: parseFloat(hallazgo.ubicacion_Latitud || hallazgo.latitud) || 21.8818, 
                                                        lng: parseFloat(hallazgo.ubicacion_Longitud || hallazgo.longitud) || -102.2915 
                                                    }
                                                }} 
                                            />
                                        );
                                    })
                                ) : (
                                    <p style={{ color: '#64748b' }}>No se encontraron hallazgos con estos filtros.</p>
                                )}

                            </div>
                        </section>
                    )}

                    {/*Reportes*/}
                    {(tipoBusqueda === 'todos' || tipoBusqueda === 'reportes') && (
                        <section>
                            <h2 style={{ fontSize: '1.5rem', color: '#0f172a', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
                                Resultados de reportes
                            </h2>
                            <div style={{ display: 'flex', flexWrap: 'nowrap', gap: '2rem', overflowX: 'auto', overflowY: 'hidden', paddingBottom: '15px', width: '100%' }}>
                                {resultadosReportes.length > 0 ? (
                                    resultadosReportes.map((reporte) => {
                                        let arregloFotosReporte = [];
                                        try{
                                            arregloFotosReporte = reporte.fotografia_url
                                                                    ? JSON.parse(reporte.fotografia_url) 
                                                                    : ['/logo.png'];
                                        } catch (error){
                                            arregloFotosReporte = [reporte.fotografia_url || '/logo.png'];
                                        }
                                        return(
                                            <TarjetaReporte 
                                                key={reporte.id} 
                                                datos={{
                                                    ...reporte,
                                                    id: reporte.id,
                                                    tipoDeReporte: reporte.tipo_reporte,
                                                    categoriaReporte: reporte.categoría, 
                                                    descripcion: reporte.descripcion,
                                                    fecha: reporte.fecha_reporte || reporte.fecha ? (reporte.fecha_reporte || reporte.fecha).split('T')[0] : 'Sin fecha',
                                                    anonimo: reporte.anonimo === 1 || reporte.anonimo === true,
                                                    nombreUsuario: (reporte.anonimo === 1 || reporte.anonimo === true) ? 'Anónimo' : (reporte.nombre_usuario || 'Usuario Desconocido'),
                                                    fotos: arregloFotosReporte, 
                                                    foto: '/logo.png', 
                                                    lugarEstado: reporte.ubicacion_Estado,
                                                    lugarMunicipio: reporte.ubicacion_Municipio,
                                                    coordenadas: { 
                                                        lat: parseFloat(reporte.ubicacion_Latitud) || 21.8818, 
                                                        lng: parseFloat(reporte.ubicacion_Longitud) || -102.2915 
                                                    }
                                                }} 
                                            />
                                        );
                                    })
                                ) : (
                                    <p style={{ color: '#64748b' }}>No se encontraron reportes con estos filtros.</p>
                                )}
                            </div>
                        </section>
                    )}

                </div>
            )}
        </div>
    );
}