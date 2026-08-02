import { tiposDeHallazgos } from './tiposDeHallazgos';
import { TextField, MenuItem } from '@mui/material';
import Button from '@mui/material/Button';
import dynamic from 'next/dynamic';
import { useAuth } from '@/context/AuthContext';
import { ubicacionesMexico } from './ubicaciones';
const MapaUbicacion = dynamic(() => import('./Mapa'), { ssr: false });


export default function FormularioHallazgo ({datos, handleChange, handleFotosChange, handleCoordenadasChange, handleSubmit}){

    const { usuario } = useAuth();

    const tiposDisponibles = Object.keys(tiposDeHallazgos);
        const categorias = datos.tipoDeHallazgo
      ? tiposDeHallazgos[datos.tipoDeHallazgo] || [] 
    : [];

    const estadosDisponibles = Object.keys(ubicacionesMexico);
    const municipiosLugar = datos.lugarEstado 
        ? ubicacionesMexico[datos.lugarEstado] || [] 
        : [];

    return(
        <form onSubmit={handleSubmit} style={{minWidth:'300px', width:'650px',backgroundColor: '#F8fafc',padding:'1.5rem', borderRadius: '10px',margin:'1rem'}}>
            <p style={{fontSize:'30px', alignItems:'center'}}><strong>Nuevo hallazgo</strong></p>
            <ul>
                <li><strong>Tipo de Hallazgo</strong>
                    <TextField
                        select
                        required
                        name="tipoDeHallazgo"
                        value={datos.tipoDeHallazgo || ''}
                        onChange={handleChange}
                        className='inputStyle' >
                            {tiposDisponibles.map((tipo) => (
                            <MenuItem key={tipo} value={tipo}>
                                {tipo}
                            </MenuItem>
                            ))}
                    </TextField>
                </li>
                <li><strong>Categoria de Hallazgo</strong>
                    <TextField
                        select
                        required 
                        label=""
                        name="categoriaHallazgo"
                        value={datos.categoriaHallazgo || ''}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        disabled={!datos.tipoDeHallazgo}>
                    
                        {categorias.length === 0 ? (
                        <MenuItem value="" disabled>Selecciona un estado primero</MenuItem>
                        ) : (
                        categorias.map((categoria) => (
                            <MenuItem key={categoria} value={categoria}>
                            {categoria}
                            </MenuItem>
                        ))
                        )}
                    </TextField>
                </li>
                <li><strong>Descripción</strong>
                    <textarea name="descripcion" value={datos.descripcion} onChange={handleChange} className="inputStyle" required />
                </li>
                <li><strong>Fecha de hallazgo</strong>
                    <input type="date" name="fecha" value={datos.fecha} onChange={handleChange} className="inputStyle" required />
                </li>
                <li><strong>Fotos del hallazgo</strong>
                    <input 
                        type="file" 
                        multiple 
                        required 
                        accept="image/*" 
                        onChange={handleFotosChange} 
                        className="inputStyle"
                    />
                    {datos.fotos && datos.fotos.length > 0 && (
                        <div style={{ marginTop: '10px' }}>
                            <strong style={{ fontSize: '0.85rem', color: '#666' }}>
                                Imágenes seleccionadas: {datos.fotos.length}
                            </strong>
                            
                            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
                                {datos.fotos.map((foto, index) => (
                                    <img 
                                        key={index} 
                                        src={URL.createObjectURL(foto)} 
                                        alt={`Vista previa ${index + 1}`}
                                        style={{ 
                                            width: '100px', 
                                            height: '100px', 
                                            objectFit: 'cover', 
                                            borderRadius: '8px',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                        }} 
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </li>
                <li><strong>Ubicacion</strong>
                    <TextField
                        select
                        required 
                        label="Estado"
                        name="lugarEstado"
                        value={datos.lugarEstado || ''}
                        onChange={handleChange}
                        className='inputStyle' >
                            {estadosDisponibles.map((estado) => (
                            <MenuItem key={estado} value={estado}>
                                {estado}
                            </MenuItem>
                            ))}
                    </TextField>
                
                    <TextField
                        select
                        required 
                        label="Municipio"
                        name="lugarMunicipio"
                        value={datos.lugarMunicipio || ''}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        disabled={!datos.lugarEstado}> 
                    
                        {municipiosLugar.length === 0 ? (
                        <MenuItem value="" disabled>Selecciona un estado primero</MenuItem>
                        ) : (
                        municipiosLugar.map((municipio) => (
                            <MenuItem key={municipio} value={municipio}>
                            {municipio}
                            </MenuItem>
                        ))
                        )}
                    </TextField>
                    <MapaUbicacion 
                        coordenadas={datos.coordenadas} 
                        setCoordenadas={handleCoordenadasChange} 
                    />
            
                    <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '5px' }}>
                        Latitud: {datos.coordenadas.lat.toFixed(5)} | Longitud: {datos.coordenadas.lng.toFixed(5)}
                    </p>
                </li>
                <li>
                    <Button type="submit" variant="contained" style={{ backgroundColor: '#7b1112', color: 'white', width: '100%', padding: '0.8rem', borderRadius: '8px', textTransform: 'none', fontSize: '1rem', fontWeight: 'bold' }}
                    onClick={(e) => {
                            if (!usuario.id) {
                                e.currentTarget.setCustomValidity('Debes iniciar sesión para poder publicar');
                                e.currentTarget.reportValidity();
                                e.preventDefault(); 
                            } else {
                                e.currentTarget.setCustomValidity('');
                            }
                        }}>
                        Publicar
                    </Button>
                </li>    
            </ul>
        </form>
    );
}