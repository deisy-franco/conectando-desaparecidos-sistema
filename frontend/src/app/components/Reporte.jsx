const MapaUbicacion = dynamic(() => import('./Mapa'), { ssr: false });
import dynamic from 'next/dynamic';

export default function Reporte({datos}){
    return(
        <div style={{
            flex: '1',
            minwidth: '400px',
            minHeight: '500px',
            width: '600px',
            backgroundColor: '#f8fafc',
            border: '2px solid #7b1113',
            padding: '1.5rem',
            boxSizing: 'border-box',
            borderRadius: '20px'
            }}>
            <ul>
                <li style={{fontSize:20,paddingBottom: '1rem'}}><strong>Reporte</strong></li>
                <li><strong>Tipo de reporte:</strong> {datos.tipoDeReporte}</li>
                <li><strong>Categoria de reporte:</strong> {datos.categoriaReporte}</li>
                <li><strong>Descripción:</strong> {datos.descripcion}</li>
                <li><strong>Fecha de reporte: </strong>{datos.fecha}</li>
                <li><strong>Fotografias</strong></li>
                <li style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '1rem',      
                    marginTop: '1rem' 
                    }}>
                    {datos.fotos.map((foto, index) => (
                        <img 
                            key={index} 
                            src={foto} 
                            alt={`Evidencia ${index + 1}`} 
                            style={{
                                width: '120px',
                                height: '120px',
                                objectFit: 'cover', 
                                borderRadius: '8px',
                                border: '1px solid #ccc'
                            }}
                        />
                    ))}
                </li>
                <li><strong>Ubicacion:</strong> {datos.lugarMunicipio}, {datos.lugarEstado} </li>
                <li><MapaUbicacion 
                    coordenadas={datos.coordenadas} />
                </li>
                {!datos.anonimo && (
                    <li style={{color:'grey'}}>Publicado por: {datos.nombreUsuario}</li>
                )}
            </ul>
        </div>
    );
}