'use client'
import { createContext, useContext, useState, useEffect, ReactNode  } from 'react';

const AuthContext = createContext<any>({});

export function AuthProvider({ children }: { children: ReactNode }) {
    // 1. Iniciamos con un usuario vacío (o nulo)
    const [usuario, setUsuario] = useState({});
    
    // ✨ EXTRA: Bandera de carga para que la pantalla no "parpadee" 
    // mostrando el botón de Iniciar Sesión por 1 segundo antes de leer la memoria.
    const [cargando, setCargando] = useState(true);

    // ✨ PASO 1: RESCATAR LA SESIÓN AL RECARGAR LA PÁGINA
    useEffect(() => {
        // Buscamos si dejamos un usuario guardado la última vez
        const sesionGuardada = localStorage.getItem('sesion_conectando');
        
        if (sesionGuardada) {
            // Si existe, lo convertimos de texto a objeto y lo restauramos
            setUsuario(JSON.parse(sesionGuardada));
        }
        
        // Ya terminamos de revisar, le decimos a la app que ya puede mostrar la página
        setCargando(false);
    }, []); // Los corchetes vacíos [] indican que esto solo se ejecuta 1 vez al abrir la página

    // ✨ PASO 2: MODIFICAR TU FUNCIÓN DE INICIAR SESIÓN
    const iniciarSesion = (datosDelUsuario: any) => {
        setUsuario(datosDelUsuario); // Lo guardamos en React
        // Lo guardamos en el disco duro del navegador
        localStorage.setItem('sesion_conectando', JSON.stringify(datosDelUsuario));
    };

    // ✨ PASO 3: MODIFICAR TU FUNCIÓN DE CERRAR SESIÓN
    const cerrarSesion = () => {
        setUsuario({}); // Lo borramos de React
        localStorage.removeItem('sesion_conectando'); // Lo borramos del navegador
    };

    return (
        <AuthContext.Provider value={{ usuario, iniciarSesion, cerrarSesion }}>
            {/* Solo mostramos la página hasta que hayamos terminado de revisar el localStorage */}
            {!cargando && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);