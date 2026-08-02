import Button from '@mui/material/Button';
import TodayIcon from '@mui/icons-material/Today';
import LocationPinIcon from '@mui/icons-material/LocationPin';
import GppMaybeOutlinedIcon from '@mui/icons-material/GppMaybeOutlined';
import Reporte from './Reporte'
import Modal from '@mui/material/Modal'; 
import React, { useState } from 'react';

export default function TarjetaReporte({datos}) {
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
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)'}}>
        <div style={{ display: 'flex',gap:'1.5rem',paddingBottom: '1rem' }}>
          <GppMaybeOutlinedIcon color='error' style={{fontSize: '100px'}}/>
          <ul>
            <li><strong>Denuncia ciudadana</strong></li>
            <li style={{ 
              border: '1px solid #e2e8f0', 
              backgroundColor: '#f8fafc', 
              padding: '0.2rem 0.5rem', 
              borderRadius: '4px', 
              fontSize: '1rem', 
              fontWeight: 'bold',
              width: 'fit-content',
              margin:'1rem'}}>Reporte</li>
          </ul>
        </div>
        <div>
          <ul>
            <li><TodayIcon></TodayIcon>{datos.fecha}</li>
            <li><LocationPinIcon></LocationPinIcon>{datos.lugarMunicipio}, {datos.lugarEstado}</li>
            <li><Button variant="outlined" color="error" onClick={handleOpen}>Ver detalle</Button></li>
          </ul>
        </div>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-ficha-busqueda">
        <div className='estilo-modal'>
          <Reporte datos={datos}/>
        </div>
      </Modal>
    </>
  );
}