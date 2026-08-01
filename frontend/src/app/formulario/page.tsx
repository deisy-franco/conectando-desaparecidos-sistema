'use client'
import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { useRouter } from 'next/navigation';
import Formulario from '../components/Formulario';
import Plantilla from '../components/FichaDeBusqueda';
import { useAuth } from '@/context/AuthContext';
import { Button, Popover } from '@mui/material';
import axios from 'axios';

export default function Page(){
    const { usuario } = useAuth();

    const router = useRouter();

    const [datos,setDatos] = useState({
        nombre:'', edad:'', genero:'', foto: '/logo.png', fecha:'',vestimenta:'', estatura:'', 
        complexion:'', cara:'', piel:'',cabello:'', ojos:'', nariz:'', boca:'', labios:'', detalles:'',
        email:'', tel:'', lugarEstado: '', lugarMunicipio: '', ultUbiEstado: '', ultUbiMunicipio: ''
    });

    const [archivoFoto, setArchivoFoto] = useState<File | null>(null);

    const [botonAncla, setBotonAncla] = useState<HTMLButtonElement | null>(null);

    const plantillaRef = useRef(null);

    const validarCampos = (eventoClic: React.MouseEvent<HTMLButtonElement>) => {
        const hayCamposVacios = Object.values(datos).some(valor => valor === '');

        if (hayCamposVacios) {
            setBotonAncla(eventoClic.currentTarget);
            setTimeout(() => {
                setBotonAncla(null);
            }, 3000);
            return false; 
        }
        return true; 
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = e.target;
        if (name === 'edad'){
            if (Number(value) > 125 || Number(value) < 0) return;
            if (value.includes('.')) return;
        }
        if (name === 'estatura') {
            const numEstatura = Number(value);
            if (numEstatura > 2.60 || numEstatura < 0) return; 
        }
        if (name === 'lugarEstado') {
            setDatos({...datos, lugarEstado: value, lugarMunicipio: '' });
            return;
        }
        if (name === 'ultUbiEstado') {
            setDatos({...datos, ultUbiEstado: value, ultUbiMunicipio: '' });
            return;
        }
        if (name === 'tel') {
            if (!/^\d*$/.test(value)) return;
            if (value.length > 10) return;
        }
        setDatos({ ...datos, [e.target.name]: e.target.value });
    };
    
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0];
    if (archivo) {
        //Guardamos el archivo físico (el JPG/PNG) para mandarlo al backend
        setArchivoFoto(archivo); 
        
        //Mantenemos la vista previa para tu componente Plantilla
        setDatos({ ...datos, foto: URL.createObjectURL(archivo) });
    }
    };

    //PASAMOS EL EVENTO A LAS FUNCIONES
    const descargarPNG = async (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!validarCampos(e)) return;

        if (!plantillaRef.current) return;
        const canvas = await html2canvas(plantillaRef.current, { scale: 2 });
        const imagenData = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = imagenData;
        link.download = `ficha-registro.png`; 
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handlePublicar = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); 
    
    //Validamos que no falte nada
    if (!validarCampos(e)) return;

    //Construimos el FormData (Requisito obligatorio para subir archivos)
    const formData = new FormData();

    //Empacamos el archivo físico
    if (archivoFoto) {
        formData.append('foto', archivoFoto);
    }

    //Empacamos el resto de los datos de texto
    formData.append('usuario_id', usuario.id);
    formData.append('nombre', datos.nombre);
    formData.append('edad', datos.edad);
    formData.append('genero', datos.genero);
    if (datos.fecha) formData.append('fecha_desaparicion', datos.fecha);
    if (datos.estatura) formData.append('estatura_m', datos.estatura);
    if (datos.piel) formData.append('color_de_piel', datos.piel);
    formData.append('lugarEstado', datos.lugarEstado);
    formData.append('lugarMunicipio', datos.lugarMunicipio);
    formData.append('ultUbiEstado', datos.ultUbiEstado);
    formData.append('ultUbiMunicipio', datos.ultUbiMunicipio);
    formData.append('vestimenta', datos.vestimenta);
    formData.append('complexion', datos.complexion);
    formData.append('cara', datos.cara);
    formData.append('cabello', datos.cabello);
    formData.append('ojos', datos.ojos);
    formData.append('nariz', datos.nariz);
    formData.append('boca', datos.boca);
    formData.append('labios', datos.labios);
    formData.append('senas_particulares', datos.detalles);
    formData.append('correo_electronico', datos.email);
    formData.append('numero', datos.tel);
    formData.append('estatus', 'desaparecido');

    console.log("=== ENVIANDO FORM DATA CON ARCHIVO ===");

    try {
        const respuesta = await axios.post('http://localhost:3001/api/fichas', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        
        if (respuesta.status === 201) {
            alert('Ficha publicada correctamente');
            router.push('/fichasDeBusqueda');
        }
    } catch (error) {
        console.error("Hubo un error al publicar:", error);
        alert("Error al conectar con la base de datos. Revisa la consola.");
    }
};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const publicarFicha = async (datosDelFormulario: any) => {
    try {
        // Preparamos el objeto con los datos. 
        const payload = {
            ...datosDelFormulario,
            usuario_id: 1,
            estatus: 'desaparecido'
        };

        const respuesta = await axios.post('http://localhost:3001/api/fichas', payload);

        if(respuesta.status === 201) {
            alert('Ficha publicada correctamente');
        }
    } catch (error) {
        console.error("Hubo un error al publicar:", error);
        alert('Error al conectar con la base de datos');
    }
    };

    return(
        <>
        <div style={{display:'flex',  gap: '2rem', padding: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <div style={{flex:1}}>
                <Formulario datos={datos} handleChange={handleChange} handleImageUpload={handleImageUpload} />
            </div>
            <div style={{flex:1,position: 'sticky', top: '2rem', height: 'fit-content'}}>
                <div style={{height: 'fit-content'}} ref={plantillaRef}>    
                    <Plantilla datos={datos}></Plantilla>
                </div>
                
                {/* BOTÓN DESCARGAR */}
                <Button onClick={descargarPNG} variant='contained' style={{margin:'1rem', backgroundColor:'#000000'}}>
                    Descargar PNG
                </Button>
                
                <Button 
                    type="submit" 
                    form="formulario-ficha" 
                    variant="contained"  
                    style={{margin:'1rem', backgroundColor:'#7b1113'}}
                    onClick={(e) => {
                        if (!usuario.id) {
                            // Si no hay sesión, lanzamos la alerta del navegador
                            e.currentTarget.setCustomValidity('Debes iniciar sesión para poder publicar');
                            e.currentTarget.reportValidity();
                            e.preventDefault(); 
                        } else {
                            // Si sí hay sesión, limpiamos el error del navegador y ejecutamos tu función normal
                            e.currentTarget.setCustomValidity('');
                            handlePublicar(e); 
                        }
                    }}
                >
                    Publicar
                </Button>
            </div>
        </div> 

        <Popover
            open={Boolean(botonAncla)}
            anchorEl={botonAncla}
            onClose={() => setBotonAncla(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            transformOrigin={{ vertical: 'top', horizontal: 'center' }}
            slotProps={{
                paper: {
                    style: {
                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.15)', 
                        border: '1px solid #cbd5e1', 
                        borderRadius: '4px',
                        marginTop: '8px', 
                        overflow: 'visible'
                    }
                }
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', backgroundColor: 'white' }}>
                <div style={{
                    backgroundColor: '#ea580c', 
                    color: 'white',
                    width: '22px', height: '22px',
                    display: 'flex', justifyContent: 'center', alignItems: 'center',
                    borderRadius: '2px', fontWeight: 'bold', fontSize: '14px'
                }}>
                    !
                </div>
                <span style={{ fontSize: '14px', color: '#334155', fontWeight: '500' }}>
                    Completa todos los campos
                </span>
            </div>
        </Popover>
        </> 
    );
}