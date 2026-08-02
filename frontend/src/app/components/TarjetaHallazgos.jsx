import Button from '@mui/material/Button';
import TodayIcon from '@mui/icons-material/Today';
import LocationPinIcon from '@mui/icons-material/LocationPin';
import Hallazgo from './Hallazgo'
import Modal from '@mui/material/Modal'; 
import React, { useState } from 'react';

export default function TarjetaHallazgo({datos}) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return(
    <>
      <div style={{
        width: '300px',
        backgroundColor:'#FFFFFF',
        border: '1.5px solid #e2e8f0',
        borderRadius: '12px',
        padding: '1.2rem',
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
      }}>

        {datos.fotos && datos.fotos.length > 0 && (
          <div style={{ display: 'flex',gap:'1.5rem',paddingBottom: '1rem' }}>
            <img 
              src={datos.fotos[0]} 
              alt="Foto del usuario" 
              style={{ 
                maxWidth: '100px',
                maxHeight: '100px',
                width: '100px',
                height: 'auto',
                display: 'block',
                borderRadius: '8px'
              }} 
            />
            <ul>
              <li><strong>{datos.tipoDeHallazgo}</strong></li>
              <li style={{ 
                border: '1px solid #e2e8f0', 
                backgroundColor: '#f8fafc', 
                padding: '0.2rem 0.5rem', 
                borderRadius: '4px', 
                fontSize: '1rem', 
                fontWeight: 'bold',
                width: 'fit-content',
                margin:'1rem'}}>Hallazgo</li>
              <li><TodayIcon></TodayIcon>{datos.fecha}</li>
              <li><LocationPinIcon></LocationPinIcon>{datos.lugarMunicipio}, {datos.lugarEstado}</li>
              <li><Button variant="outlined" color="error" onClick={handleOpen}>Ver detalle</Button></li>
            </ul>
          </div>
        )}
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-ficha-busqueda">
        <div className="estilo-modal">
          <Hallazgo datos={datos}/>
        </div>
      </Modal>
    </>
  );
}