'use client'
import React from 'react';
import { useRouter } from 'next/navigation';
import Button from '@mui/material/Button';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import GppMaybeOutlinedIcon from '@mui/icons-material/GppMaybeOutlined';
import GppMaybeIcon from '@mui/icons-material/GppMaybe';
import PersonSearchOutlinedIcon from '@mui/icons-material/PersonSearchOutlined';
import FindInPageRoundedIcon from '@mui/icons-material/FindInPageRounded';
import FindInPageOutlinedIcon from '@mui/icons-material/FindInPageOutlined';
import { useAuth } from '@/context/AuthContext';

export default function Inicio() {
    const { usuario } = useAuth();

    const router = useRouter(); 

    return (
        <div style={{ backgroundColor: '#050505', minHeight: '100vh', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div style={{
                backgroundColor: '#050505',
                width: '100%',
                minHeight: '350px',
                borderRadius: '24px',
                display: 'flex',
                overflow: 'hidden', 
                color: 'white',
                flexWrap: 'wrap' 
            }}>
                
                <div style={{ flex: '1 1 50%', padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', minWidth: '300px' }}>
                    <h1 style={{ fontSize: '2.8rem', fontWeight: 'bold', lineHeight: '1.1', margin: 0 }}>
                        Unidos para buscar,<br />encontrar y apoyar.
                    </h1>
                    <p style={{ fontSize: '1.1rem', color: '#e2e8f0', margin: '1.5rem 0', lineHeight: '1.5' }}>
                        Cada publicación puede ser la pieza<br />que falta para volver a casa.
                    </p>
                    
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <Button 
                            variant="contained" 
                            onClick={() => router.push('/formulario')}
                            style={{ backgroundColor: '#cc0000', color: 'white', textTransform: 'none', fontWeight: 'bold', padding: '0.6rem 1.5rem', borderRadius: '8px' }}
                        >
                            Crear ficha de búsqueda
                        </Button>
                        <Button 
                            variant="outlined"
                            onClick={()=> router.push('/hallazgos')} 
                            style={{ borderColor: 'white', color: 'white', textTransform: 'none', fontWeight: 'bold', padding: '0.6rem 1.5rem', borderRadius: '8px' }}
                        >
                            Ver hallazgos
                        </Button>
                    </div>
                </div>

                <div style={{ flex: '1 1 50%', position: 'relative', minHeight: '350px', minWidth: '300px' }}>
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
                    
                    <div style={{ 
                        position: 'absolute', 
                        top: 0, 
                        left: 0, 
                        width: '120px', 
                        height: '100%', 
                        background: 'linear-gradient(to right, #050505 0%, transparent 100%)' 
                    }}></div>
                    
                    <img 
                        src="/fondoPaginaPrincipal.png" 
                        alt="Personas" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} 
                    />
                    </div>
                </div>
            </div>

            {/*Tarjetas Blancas*/}
            <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '24px',
                padding: '2rem 3rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}>
                <h2 style={{ margin: '0 0 1.5rem 0', fontSize: '1.3rem', fontWeight: 'bold', color: '#0f172a' }}>
                    Acciones rápidas
                </h2>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    
                    <div style={estiloTarjetaAccion} onClick={() => router.push('/fichasDeBusqueda')}>
                        <PersonSearchOutlinedIcon style={estiloIcono} />
                        <h3 style={estiloTituloTarjeta}>Ver fichas<br/>de búsqueda</h3>
                        <p style={estiloTextoTarjeta}>Explora las fichas<br />de busqueda publicadas</p>
                    </div>

                    <div style={estiloTarjetaAccion} onClick={() => router.push('/formulario')}>
                        <PersonSearchIcon style={estiloIcono} />
                        <h3 style={estiloTituloTarjeta}>Crear ficha<br/>de búsqueda</h3>
                        <p style={estiloTextoTarjeta}>Reporta una desaparición sin esperar 72 horas</p>
                    </div>

                    <div style={estiloTarjetaAccion} onClick={() => router.push('/hallazgos')}>
                        <FindInPageOutlinedIcon style={estiloIcono} />
                        <h3 style={estiloTituloTarjeta}>Ver hallazgos</h3>
                        <p style={estiloTextoTarjeta}>Explora los hallazgos publicados</p>
                    </div>

                    {usuario.id && (<div style={estiloTarjetaAccion} onClick={() => router.push('/crearHallazgo')}>
                        <FindInPageRoundedIcon style={estiloIcono} />
                        <h3 style={estiloTituloTarjeta}>Publicar hallazgo</h3>
                        <p style={estiloTextoTarjeta}>Sube fotos de objetos encontrados</p>
                    </div>)}

                    <div style={estiloTarjetaAccion} onClick={() => router.push('/reportes')}>
                        <GppMaybeOutlinedIcon style={estiloIcono} />
                        <h3 style={estiloTituloTarjeta}>Ver reportes</h3>
                        <p style={estiloTextoTarjeta}>Explora los reportes publicados</p>
                    </div>

                    {usuario.id && (<div style={estiloTarjetaAccion} onClick={() => router.push('/crearReporte')}>
                        <GppMaybeIcon style={estiloIcono} />
                        <h3 style={estiloTituloTarjeta}>Publicar Reporte</h3>
                        <p style={estiloTextoTarjeta}>Reporta avistamientos<br />sospechosos</p>
                    </div>)}
                </div>
            </div>
        </div>
    );
}

//Estilos
const estiloTarjetaAccion = {
    flex: '1 1 180px',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    textAlign: 'center' as const,
    padding: '1.5rem 1rem',
    borderRadius: '12px',
    border: '1px solid #f1f5f9',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
};

const estiloIcono = {
    fontSize: '2.5rem',
    color: '#0f172a',
    marginBottom: '0.8rem'
};

const estiloTituloTarjeta = {
    fontSize: '0.95rem',
    fontWeight: 'bold',
    color: '#0f172a',
    margin: '0 0 0.5rem 0',
    lineHeight: '1.2'
};

const estiloTextoTarjeta = {
    fontSize: '0.75rem',
    color: '#64748b',
    margin: 0,
    lineHeight: '1.4'
};