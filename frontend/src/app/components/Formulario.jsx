import { TextField, MenuItem, Button } from '@mui/material';
import { ubicacionesMexico } from './ubicaciones';
import React, { useState } from 'react';

//Formulario de ficha de busqueda
export default function Formulario({datos, handleChange, handleImageUpload}){

    const estadosDisponibles = Object.keys(ubicacionesMexico);
        
    const municipiosLugar = datos.lugarEstado 
      ? ubicacionesMexico[datos.lugarEstado] || [] 
      : [];
        
    const municipiosUltUbi = datos.ultUbiEstado 
      ? ubicacionesMexico[datos.ultUbiEstado] || [] 
      : [];
          
    const [archivoFoto, setArchivoFoto] = useState(null);

    const handleFileChange = (e) => {
    setArchivoFoto(e.target.files[0]);
    };  

    return(
        <form id="formulario-ficha"style={{flex:'1', minWidth:'300px',backgroundColor: '#f8fafc',padding:'1.5rem', borderRadius: '10px'}}>
            <h2><strong>Ingresa los datos</strong></h2>
            <ul>
                <li><strong>Nombre completo:</strong>
                    <input type="text" name="nombre" value={datos.nombre} onChange={handleChange} className="inputStyle" required />
                </li>
                <li><strong>Edad:</strong>
                    <input type="number" min={1} max={125} name="edad" value={datos.edad} onChange={handleChange} className="inputStyle" required />
                </li>
                <li><strong>Genero:</strong>
                    <select id="genero" name="genero" value={datos.genero} onChange={handleChange} className='inputStyle' required>
                        <option value="" disabled>Elige una opción</option>
                        <option value="Masculino">Masculino</option>
                        <option value="Femenino">Femenino</option>
                    </select>   
                </li>
                <li><strong>Fotografía de evidencia:</strong>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="inputStyle" required />
                </li>
                <li><strong>Fecha de desaparición:</strong>
                    <input type="date" name="fecha" value={datos.fecha} onChange={handleChange} className="inputStyle" required />
                </li>
                <li><strong>Lugar:</strong>
                    <TextField
                        select
                        required
                        label="Estado"
                        name="lugarEstado"
                        value={datos.lugarEstado || ''}
                        onChange={handleChange}
                        className='inputStyle' 
                    >
                        {estadosDisponibles.map((estado) => (
                        <MenuItem key={estado} value={estado}>
                            {estado}
                        </MenuItem>
                        ))}
                    </TextField>

                    {/*Selector de municipio dinamico*/}
                    <TextField
                        select
                        required
                        label="Municipio"
                        name="lugarMunicipio"
                        value={datos.lugarMunicipio || ''}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        disabled={!datos.lugarEstado}
                    > 
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
                </li>
                <li><strong>Ultima ubicación:</strong>
                    <TextField
                        select
                        required
                        label="Estado"
                        name="ultUbiEstado"
                        value={datos.ultUbiEstado || ''}
                        onChange={handleChange}
                        className='inputStyle'
                    >
                        {estadosDisponibles.map((estado) => (
                        <MenuItem key={estado} value={estado}>
                            {estado}
                        </MenuItem>
                        ))}
                    </TextField>

                    {/*Selector de municipio dinamico*/}
                    <TextField
                        select
                        required
                        label="Municipio"
                        name="ultUbiMunicipio"
                        value={datos.ultUbiMunicipio || ''}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                        disabled={!datos.ultUbiEstado}
                    > 
                        {municipiosUltUbi.length === 0 ? (
                        <MenuItem value="" disabled>Selecciona un estado primero</MenuItem>
                        ) : (
                        municipiosUltUbi.map((municipio) => (
                            <MenuItem key={municipio} value={municipio}>
                            {municipio}
                            </MenuItem>
                        ))
                        )}
                    </TextField>
                </li>
                <li><strong>Vestimenta:</strong>
                    <input type="text" name="vestimenta" value={datos.vestimenta} onChange={handleChange} className="inputStyle" required />
                </li>
                <li><strong>Estatura:</strong>
                    <TextField
                        type="number"
                        required
                        label="Estatura (metros)"
                        name="estatura"
                        value={datos.estatura || ''}
                        onChange={handleChange}
                        fullWidth
                        slotProps={{
                            htmlInput: {
                            min: 0,
                            max: 2.60,
                            step: 0.01
                            }
                        }}
                    />
                </li>
                <li><strong>Complexión:</strong>
                    <input type="text" name="complexion" value={datos.complexion} onChange={handleChange} className="inputStyle" required />
                </li>
                <li><strong>Cara:</strong>
                    <input type="text" name="cara" value={datos.cara} onChange={handleChange} className="inputStyle" required />
                </li>
                <li><strong>Color de piel:</strong>
                    <input type="text" name="piel" value={datos.piel} onChange={handleChange} className="inputStyle" required />
                </li>
                <li><strong>Cabello:</strong>
                    <input type="text" name="cabello" value={datos.cabello} onChange={handleChange} className="inputStyle" required />
                </li>
                <li><strong>Ojos:</strong>
                    <input type="text" name="ojos" value={datos.ojos} onChange={handleChange} className="inputStyle" required />
                </li>
                <li><strong>Nariz:</strong>
                    <input type="text" name="nariz" value={datos.nariz} onChange={handleChange} className="inputStyle" required />
                </li>
                <li><strong>Boca:</strong>
                    <input type="text" name="boca" value={datos.boca} onChange={handleChange} className="inputStyle" required />
                </li>
                <li><strong>Labios:</strong>
                    <input type="text" name="labios" value={datos.labios} onChange={handleChange} className="inputStyle" required />
                </li>
                <li><strong>Señas particulares:</strong>
                    <textarea name="detalles" value={datos.detalles} onChange={handleChange} className="inputStyle" required />
                </li>
            </ul>
            <p><strong>Medios de comunicación</strong></p>
            <ul>
                <li><strong>Correo electronico:</strong>
                    <input type="email" name="email" value={datos.email} onChange={handleChange} className="inputStyle" required />
                </li>
                <li><strong>Numero telefonico:</strong>
                    <input type="text" name="tel" value={datos.tel} onChange={handleChange} className="inputStyle" required />
                </li>
            </ul> 
        </form>
    );
}