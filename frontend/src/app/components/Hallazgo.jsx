const MapaUbicacion = dynamic(() => import('./Mapa'), { ssr: false });
import dynamic from 'next/dynamic';

export default function Hallazgo({datos}){

    return(
        <div style={{flex: '1', minwidth: '400px', minHeight: '500px', width: '600px', backgroundColor: '#f8fafc', border: '2px solid #7b1113', padding: '1.5rem', boxSizing: 'border-box', borderRadius: '20px' }}>
            <ul>
                <li style={{fontSize:20,paddingBottom: '1rem'}}><strong>Hallazgo</strong></li>
                <li><strong>Tipo de hallazgo:</strong> {datos.tipoDeHallazgo}</li>
                <li><strong>Categoria de hallazgo:</strong> {datos.categoriaHallazgo}</li>
                <li><strong>Descripción:</strong> {datos.descripcion}</li>
                <li><strong>Fecha de hallazgo: </strong>{datos.fecha}</li>
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
                            style={{width: '120px', height: '120px', objectFit: 'cover',  borderRadius: '8px', border: '1px solid #ccc'}}
                        />
                    ))}
                </li>
                <li><strong>Ubicacion:</strong> {datos.lugarMunicipio}, {datos.lugarEstado} </li>
                <li><MapaUbicacion 
                coordenadas={datos.coordenadas} />
                </li>
            </ul>
        </div>
    );
}