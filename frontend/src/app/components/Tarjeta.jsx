import Button from '@mui/material/Button';
import TodayIcon from '@mui/icons-material/Today';
import LocationPinIcon from '@mui/icons-material/LocationPin';
import PersonIcon from '@mui/icons-material/Person';
import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Plantilla from './FichaDeBusqueda';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { useRef } from 'react';
import html2canvas from 'html2canvas';
import { API_URL } from '@/lib/api';

//Tarjeta de fiha de busqueda
export default function Tarjeta({datos}) {
  const { usuario } = useAuth();
  const [estatusActual, setEstatusActual] = useState(datos.estatus);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const marcarComoEncontrada = async () => {
    const confirmar = window.confirm("¿Estás seguro de marcar a esta persona como ENCONTRADA? Esta acción no se puede deshacer.");
      if (!confirmar) return;

        try {
          const respuesta = await axios.put(`${API_URL}/api/fichas/${datos.id}/estatus`, {
            usuario_id: usuario.id
          });

          if (respuesta.status === 200) {
            alert("¡Ficha actualizada exitosamente!");
            setEstatusActual('encontrada');
          }
        } catch (error) {
          console.error("Error:", error);
          alert("No tienes permiso o hubo un error al actualizar.");
        }
  };

    // 1. Referencia al contenedor de la plantilla
    const fichaRef = useRef(null);

    // 2. Función para tomar la captura y descargarla
    const descargarImagenFicha = async () => {
        if (!fichaRef.current) return;

        try {
            // Tomamos la "foto" del elemento. useCORS es vital para que no marque error con las fotos cargadas de internet o tu servidor.
            const canvas = await html2canvas(fichaRef.current, {
                useCORS: true, 
                scale: 2, // Escala 2x para que tenga mejor resolución
                backgroundColor: '#ffffff' // Fondo blanco por si hay transparencias
            });

            // Convertimos el canvas a imagen PNG
            const dataUrl = canvas.toDataURL('image/png');

            // Creamos un enlace invisible, le ponemos el archivo y forzamos el clic
            const link = document.createElement('a');
            link.download = `Ficha-Busqueda-${datos.nombre ? datos.nombre.replace(/\s+/g, '-') : 'Desaparecido'}.png`;
            link.href = dataUrl;
            link.click();

        } catch (error) {
            console.error("Error al descargar la ficha:", error);
            alert("Hubo un problema al generar la imagen.");
        }
    };

  return(
    <>
      <div style={{
          width: 'auto',
          backgroundColor:'#FFFFFF',
          border: '1.5px solid #e2e8f0',
          borderRadius: '12px',
          padding: '1.2rem',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)'}}>

        {datos.foto && (
          <div style={{ display: 'flex',gap:'1.5rem',paddingBottom: '1rem' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={datos.foto} 
              alt="Foto del usuario" 
              style={{ 
                maxWidth: '100px',
                maxHeight: '100px',
                width: 'auto',
                height: 'auto',
                display: 'block',
                borderRadius: '8px'
              }} />
            <ul>
              <li><strong>{datos.nombre}</strong></li>
              <li style={{color: '#c62828', 
                border: '1px solid #c62828', 
                backgroundColor: '#fff0f0',
                padding: '0.2rem 0.5rem', 
                borderRadius: '4px', 
                fontSize: '1rem', 
                fontWeight: 'bold',
                width: 'fit-content',
                margin:'1rem'}}>{datos.estatus}</li>
              <li><TodayIcon></TodayIcon>{datos.fecha}</li>
              <li><LocationPinIcon></LocationPinIcon>{datos.lugarMunicipio}, <br /> {datos.lugarEstado}</li>
              <li><PersonIcon></PersonIcon>{datos.edad} años</li>
              <li><Button variant="outlined" color="error" onClick={handleOpen}>Ver ficha</Button></li>
            </ul>
          </div>
        )}
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-ficha-busqueda">
        <div className="estilo-modal" style={{backgroundColor: 'white'}}>      
          <div ref={fichaRef} style={{ padding: '10px', backgroundColor: 'white', borderRadius: '10px' }}>
            <Plantilla datos={datos} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
            <button 
              onClick={descargarImagenFicha}
              style={{
                backgroundColor: '#000000', 
                color: 'white',
                padding: '12px 24px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              DESCARGAR PNG
            </button>
          </div>
          {usuario && usuario.id == datos.usuario_id && estatusActual !== 'encontrada' && (
            <button 
              onClick={marcarComoEncontrada}
              style={{
                backgroundColor: '#22c55e',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                marginTop: '1rem',
                width: '100%'
              }}
            >
              MARCAR COMO PERSONA ENCONTRADA
            </button>
          )}
        </div>
      </Modal>      
    </>
  );
}