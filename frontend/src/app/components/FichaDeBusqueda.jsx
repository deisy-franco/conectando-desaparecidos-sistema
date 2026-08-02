import CallIcon from '@mui/icons-material/Call';
import EmailIcon from '@mui/icons-material/Email';

export default function Plantilla({ datos }) {
  return (
    <div style={{ flex: '1', minWidth: '400px', minHeight: '500px', backgroundColor: '#f8fafc', border: '2px solid #7b1113', padding: '1.5rem', boxSizing: 'border-box', borderRadius: '20px'}}>
      
      {datos.foto && (
        <div style={{ display: 'flex', gap:'1.5rem', paddingBottom: '1rem' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={datos.foto} 
            alt="Foto del usuario" 
            style={{ 
              maxWidth: '200px',
              maxHeight: '200px',
              width: 'auto',
              height: 'auto',
              display: 'block',
              borderRadius: '8px'
            }} 
          />

          <ul>
            <li style={{fontSize:20, paddingBottom: '1rem'}}><strong>FICHA DE BÚSQUEDA</strong></li>
            <li style={{fontSize:20}}>{datos.nombre}</li>
            <li><strong>Edad:</strong> {datos.edad} años</li>
            <li><strong>Género:</strong> {datos.genero}</li>
          </ul>
        </div>
      )}

      <ul>
        <li><strong>Fecha de desaparición:</strong> {datos.fecha}</li>
        <li><strong>Lugar:</strong> {datos.lugarMunicipio}, {datos.lugarEstado}</li>
        <li><strong>Última ubicación:</strong> {datos.ultUbiMunicipio}, {datos.ultUbiEstado}</li>
        <li><strong>Vestimenta:</strong> {datos.vestimenta}</li>
      </ul>

      <p><strong>Descripción física</strong></p>

      <ul>
        <li><strong>Estatura:</strong> {datos.estatura} m</li>
        <li><strong>Complexión:</strong> {datos.complexion}</li>
        <li><strong>Cara:</strong> {datos.cara}</li>
        <li><strong>Color de piel:</strong> {datos.piel}</li>
        <li><strong>Cabello:</strong> {datos.cabello}</li>
        <li><strong>Ojos:</strong> {datos.ojos}</li>
        <li><strong>Nariz:</strong> {datos.nariz}</li>
        <li><strong>Boca:</strong> {datos.boca}</li>
        <li><strong>Labios:</strong> {datos.labios}</li>
        <li><strong>Señas Particulares:</strong> {datos.detalles}</li>
      </ul>
      
      <p><strong>Reporta cualquier pista aquí:</strong></p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CallIcon sx={{ color: '#7b1113'}}/>
          <span>(+52) {datos.tel}</span>
        </div>
        <span style={{ color: '#ccc' }}>|</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <EmailIcon sx={{ color: '#7b1113' }}/>
          <span>{datos.email}</span>
        </div>
      </div>
    </div>
  );
}