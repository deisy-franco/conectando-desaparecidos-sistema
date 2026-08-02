'use client'
import React, { useState } from 'react';
import FormularioReporte from '../components/FormularioReporte'
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Page(){
    const { usuario } = useAuth();

    const router = useRouter();

    const [datos,setDatos]= useState({
        tipoDeReporte:'',
        categoriaReporte:'',
        descripcion:'',
        fecha:'',
        fotos: [] as File[],
        lugarEstado:'',
        lugarMunicipio:'', 
        coordenadas: { lat: 21.8818, lng: -102.2915 },
        anonimo: false
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const target = e.target as HTMLInputElement; 

        const { name, value, type, checked } = target;
        if (name === 'tipoDeReporte') {
            setDatos({
                ...datos,
                tipoDeReporte: value,   
                categoriaReporte: ''    
            });
            return;
        }
        
        setDatos({ 
            ...datos, 
            [name]: type === 'checkbox' ? checked : value 
        });
    };

    const handleFotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const archivosArray = Array.from(e.target.files);
            setDatos({
                ...datos,
                fotos: archivosArray
            });
        }
    };

    const handleCoordenadasChange = (nuevasCoordenadas: { lat: number, lng: number }) => {
        setDatos({ ...datos, coordenadas: nuevasCoordenadas });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData();

        if (usuario && usuario.id) {
            formData.append('usuario_id', usuario.id.toString());
        }

        // Agregamos los datos de texto
        formData.append('tipo_reporte', datos.tipoDeReporte);
        formData.append('categoria', datos.categoriaReporte);
        formData.append('anonimo', datos.anonimo.toString());
        formData.append('descripcion', datos.descripcion);
        formData.append('fecha_reporte', datos.fecha);
        formData.append('ubicacion_Estado', datos.lugarEstado);
        formData.append('ubicacion_Municipio', datos.lugarMunicipio);
        
        // Coordenadas
        if (datos.coordenadas) {
            formData.append('latitud', datos.coordenadas.lat.toString());
            formData.append('longitud', datos.coordenadas.lng.toString());
        }

        // Fotos
        if (datos.fotos && datos.fotos.length > 0) {
            datos.fotos.forEach((foto: File) => {
                formData.append('fotos', foto);
            });
        }

        try {
            const respuesta = await fetch('http://localhost:3001/api/reportes', {
                method: 'POST',
                body: formData,
            });

            if (respuesta.ok) {
                const resultado = await respuesta.json();
                console.log("REPORTE GUARDADO CON ÉXITO");
                alert("Reporte enviado correctamente");
                router.push('/reportes'); 
            } else {
                const textoError = await respuesta.text(); 
                console.error("Error del servidor:", textoError);
                alert("Hubo un error al publicar el reporte.");
            }
        } catch (error) {
            console.error("Error de conexión:", error);
        }
    };

    return(
        <div style={{display:'flex', justifyContent:'center',backgroundColor:'#ffffff'}}>
            <FormularioReporte 
                datos={datos} 
                handleChange={handleChange} 
                handleFotosChange={handleFotosChange} 
                handleCoordenadasChange={handleCoordenadasChange}
                handleSubmit={handleSubmit}
            />
        </div>
    );
}