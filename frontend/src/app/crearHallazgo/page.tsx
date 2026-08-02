'use client'
import React, { useState } from 'react';
import FormularioHallazgo from '../components/FormularioHallazgo'
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Page() {
    const router = useRouter();
    const { usuario } = useAuth();

    const [datos, setDatos] = useState({
        tipoDeHallazgo: '',
        categoriaHallazgo: '',
        descripcion: '',
        fecha: '',
        fotos: [] as File[],
        lugarEstado: '',
        lugarMunicipio: '',
        ubicacion: '',
        coordenadas: { lat: 21.8818, lng: -102.2915 }
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name === 'lugarEstado') {
            setDatos({ ...datos, lugarEstado: value, lugarMunicipio: '' });
            return;
        }

        if (name === 'tipoDeHallazgo') {
            setDatos({
                ...datos,
                tipoDeHallazgo: value,
                categoriaHallazgo: ''
            });
            return;
        }

        setDatos({ ...datos, [e.target.name]: e.target.value });
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
        } else {
            alert("Error: Debes iniciar sesión para publicar un hallazgo.");
            return;
        }

        // Textos
        formData.append('tipoDeHallazgo', datos.tipoDeHallazgo);
        formData.append('categoriaHallazgo', datos.categoriaHallazgo);
        formData.append('descripcion', datos.descripcion);
        formData.append('fecha_hallazgo', datos.fecha);
        formData.append('lugarEstado', datos.lugarEstado);
        formData.append('lugarMunicipio', datos.lugarMunicipio);

        // Coordenadas extraídas del mapa
        formData.append('latitud', datos.coordenadas.lat.toString());
        formData.append('longitud', datos.coordenadas.lng.toString());

        // Agregar las fotos al formData
        datos.fotos.forEach((foto) => {
            formData.append('fotos', foto);
        });

        try {
            const respuesta = await fetch('http://localhost:3001/api/hallazgos', {
                method: 'POST',
                body: formData,
            });

            if (respuesta.ok) {
                const resultado = await respuesta.json();
                console.log("HALLAZGO GUARDADO CON ÉXITO");
                console.log(resultado);
                router.push('/hallazgos');
            } else {
                const textoError = await respuesta.text(); 
                console.error("Error del servidor (Respuesta cruda):", textoError);
                alert("Hubo un error al publicar el hallazgo. Revisa la consola (F12).");
            }
        } catch (error) {
            console.error("Error de conexión:", error);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', backgroundColor: '#ffffff' }}>
            <FormularioHallazgo
                datos={datos}
                handleChange={handleChange}
                handleFotosChange={handleFotosChange}
                handleCoordenadasChange={handleCoordenadasChange}
                handleSubmit={handleSubmit}
            />
        </div>
    );
}