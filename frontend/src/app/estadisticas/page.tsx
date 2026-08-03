'use client'
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { 
    PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, 
    BarChart, Bar, XAxis, YAxis, CartesianGrid, 
    LineChart, Line 
} from 'recharts';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import CampaignIcon from '@mui/icons-material/Campaign';
import GroupIcon from '@mui/icons-material/Group';
import TableRowsIcon from '@mui/icons-material/TableRows'; 
import { Button } from '@mui/material';
import { useAuth } from '@/context/AuthContext';
import { PlantillaEstadisticas } from './PlantillaEstadisticas';
import { PDFDownloadLink, pdf } from '@react-pdf/renderer';
import { API_URL } from '@/lib/api';

const COLORES_ESTATUS = ['#ef4444', '#22c55e', '#64748b', '#f59e0b'];

export default function Page() {
    const { usuario } = useAuth();
    const panelRef = useRef(null);
    const donaRef = useRef(null);
    const barrasRef = useRef(null);
    const lineasRef = useRef(null);

    const [totales, setTotales] = useState({ fichas: 0, hallazgos: 0, reportes: 0, usuarios: 0 });
    const [datosEstatus, setDatosEstatus] = useState([]);
    const [datosZonas, setDatosZonas] = useState([]);
    const [datosMeses, setDatosMeses] = useState([]);

    useEffect(() => {
        const cargarEstadisticas = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/api/estadisticas`);
                
                setTotales({
                    fichas: data.tarjetas.totalFichas,
                    hallazgos: data.tarjetas.totalHallazgos,
                    reportes: data.tarjetas.totalReportes,
                    usuarios: data.tarjetas.totalUsuarios
                });
                setDatosEstatus(data.graficaEstatus);
                setDatosZonas(data.graficaZonas);

                // ✨ Traductor de meses restaurado
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const traductorMeses: any = {
                    'January': 'Enero', 'February': 'Febrero', 'March': 'Marzo', 
                    'April': 'Abril', 'May': 'Mayo', 'June': 'Junio', 
                    'July': 'Julio', 'August': 'Agosto', 'September': 'Septiembre', 
                    'October': 'Octubre', 'November': 'Noviembre', 'December': 'Diciembre'
                };
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const mesesEnEspañol = data.graficaMeses.map((item: any) => ({
                    ...item, 
                    mes: traductorMeses[item.mes] || item.mes
                }));
                
                setDatosMeses(mesesEnEspañol);

            } catch (error) {
                console.error("Error cargando estadísticas", error);
            }
        };
        cargarEstadisticas();
    }, []);

    const descargarPDF = async () => {
        if (!panelRef.current) return;
        
        window.scrollTo(0, 0);

        const canvas = await html2canvas(panelRef.current, { 
            scale: 2,
            useCORS: true,
            scrollY: -window.scrollY
        });
        
        const imgData = canvas.toDataURL('image/png');
        const anchoImagen = canvas.width;
        const altoImagen = canvas.height;
        
        const pdf = new jsPDF({
            orientation: anchoImagen > altoImagen ? 'landscape' : 'portrait',
            unit: 'px',
            format: [anchoImagen, altoImagen]
        });
        
        pdf.addImage(imgData, 'PNG', 0, 0, anchoImagen, altoImagen);
        pdf.save('Reporte-Estadisticas-Graficas.pdf');
    };

    const descargarReporteCompleto = async () => {
        // ✨ 1. Validamos que los contenedores ya estén dibujados en la pantalla
        if (!donaRef.current || !barrasRef.current || !lineasRef.current) return;

        // ✨ 2. Le juramos a TypeScript que son elementos HTML válidos usando "as HTMLElement"
        const canvasDona = await html2canvas(donaRef.current as HTMLElement, { scale: 2 });
        const canvasBarras = await html2canvas(barrasRef.current as HTMLElement, { scale: 2 });
        const canvasLineas = await html2canvas(lineasRef.current as HTMLElement, { scale: 2 });

        const fotos = {
            dona: canvasDona.toDataURL('image/png'),
            barras: canvasBarras.toDataURL('image/png'),
            lineas: canvasLineas.toDataURL('image/png')
        };

        // 3. Construimos el documento inyectando los datos Y las fotos
        const documento = <PlantillaEstadisticas 
            datos={{
                tarjetas: { totalFichas: totales.fichas, totalHallazgos: totales.hallazgos, totalReportes: totales.reportes, totalUsuarios: totales.usuarios },
                graficaZonas: datosZonas,
                graficaEstatus: datosEstatus,
                graficaMeses: datosMeses
            }} 
            imagenes={fotos} 
        />;

        // 4. Generamos el PDF invisiblemente y lo descargamos
        const blob = await pdf(documento).toBlob();
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Reporte_Oficial_Completo.pdf';
        link.click();
    };

    return (
        <>
        {usuario?.rol == 'administrador' && (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '2rem 4rem' }}>
            
            {/* ✨ Contenedor único corregido */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>
                    Panel de Estadísticas
                </h1>
                
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    
                    <Button 
        variant="contained" 
        startIcon={<TableRowsIcon />} 
        onClick={descargarReporteCompleto}
        style={{ 
            backgroundColor: '#7b1113', 
            color: 'white', 
            textTransform: 'none', 
            fontSize: '0.95rem', 
            fontWeight: 'bold',
            padding: '0.6rem 1.2rem'
        }}
    >
        Descargar Reporte con Graficas
    </Button>

                    <PDFDownloadLink
                        document={<PlantillaEstadisticas datos={{
                            tarjetas: {
                                totalFichas: totales.fichas,
                                totalHallazgos: totales.hallazgos,
                                totalReportes: totales.reportes,
                                totalUsuarios: totales.usuarios
                            },
                            graficaZonas: datosZonas,
                            graficaEstatus: datosEstatus,
                            graficaMeses: datosMeses
                        }} />} 
                        fileName="Reporte_Oficial_Datos.pdf"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            backgroundColor: '#7b1113',
                            color: 'white',
                            padding: '0.6rem 1.2rem',
                            borderRadius: '4px',
                            textDecoration: 'none',
                            fontWeight: 'bold',
                            fontSize: '0.95rem',
                            fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                            boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)' 
                        }}
                    >
                        {({ loading }) => (
                            <>
                                <TableRowsIcon fontSize="small" />
                                {loading ? 'Generando tablas...' : 'Descargar Reporte'}
                            </>
                        )}
                    </PDFDownloadLink>
                </div>
            </div>

            {/* CONTENEDOR PRINCIPAL */}
            <div ref={panelRef} style={{ backgroundColor: '#f8fafc', padding: '1rem' }}>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                    <TarjetaMetrica titulo="Fichas publicadas" valor={totales.fichas} icono={<AssignmentIcon sx={{ color: '#7b1113', fontSize: 32 }} />} />
                    <TarjetaMetrica titulo="Hallazgos publicados" valor={totales.hallazgos} icono={<ImageSearchIcon sx={{ color: '#7b1113', fontSize: 32 }} />} />
                    <TarjetaMetrica titulo="Reportes publicados" valor={totales.reportes} icono={<CampaignIcon sx={{ color: '#7b1113', fontSize: 32 }} />} />
                    <TarjetaMetrica titulo="Usuarios registrados" valor={totales.usuarios} icono={<GroupIcon sx={{ color: '#7b1113', fontSize: 32 }} />} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                    
                    <div ref={donaRef} style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                        <h2 style={{ textAlign: 'center', color: '#0f172a', marginBottom: '1rem', fontSize: '1.2rem' }}>Distribución por Estatus</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={datosEstatus} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={70} outerRadius={100} label isAnimationActive={false}>
                                    {datosEstatus.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORES_ESTATUS[index % COLORES_ESTATUS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div ref={barrasRef} style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                        <h2 style={{ textAlign: 'center', color: '#0f172a', marginBottom: '1rem', fontSize: '1.2rem' }}>Top 5 Municipios con Mayor Incidencia</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={datosZonas}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="cantidad" fill="#7b1113" radius={[4, 4, 0, 0]} isAnimationActive={false} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div ref={lineasRef} style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', gridColumn: '1 / -1' }}>
                        <h2 style={{ textAlign: 'center', color: '#0f172a', marginBottom: '1rem', fontSize: '1.2rem' }}>Tendencia de Desapariciones por Mes</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={datosMeses}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="mes" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="cantidad" stroke="#ea580c" strokeWidth={3} dot={{ r: 6 }} isAnimationActive={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                </div>
            </div>
        </div>
        )}
        </>
    );
}

function TarjetaMetrica({ titulo, valor, icono }: { titulo: string, valor: number | string, icono: React.ReactNode }) {
    return (
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '4px solid #7b1113' }}>
            <span style={{ fontSize: '1rem', color: '#64748b', fontWeight: '500' }}>{titulo}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '8px', borderRadius: '8px', display: 'flex' }}>
                    {icono}
                </div>
                <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#0f172a' }}>{valor}</span>
            </div>
        </div>
    );
}