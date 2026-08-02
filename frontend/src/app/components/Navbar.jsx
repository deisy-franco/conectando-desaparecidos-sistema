'use client'
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Navbar({}){
  const { usuario, cerrarSesion } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  //Estado para controlar si el menú de celular está abierto o cerrado
  const [menuAbierto, setMenuAbierto] = useState(false);

  const handleLogout = () => {
    cerrarSesion();
    router.push('/');
    setMenuAbierto(false); // Cerramos el menú al salir
    };

    if (pathname === '/login') {
      return null;
    }

  const obtenerEstiloEnlace = (rutaDestino) => {
        if (pathname === rutaDestino) {
            return {
                color: '#cc0000',
                fontWeight: 'bold',
                textDecoration: 'none',
                borderBottom: '2px solid #cc0000',
                paddingBottom: '4px'
            };
        }
        return {
            color: '#334155',
            fontWeight: 'normal',
            textDecoration: 'none'
        };
    };

  const cerrarMenu = () => setMenuAbierto(false);

  return (
    <>
      <style>{`
        .nav-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          background-color: #ffffff;
          padding: 1rem 2rem;
          box-sizing: border-box;
          border-bottom: 1px solid #eaeaea;
          position: relative; /* Clave para que el menú flote encima de la página */
          z-index: 50;
        }

        /* Contenedor que agrupa los enlaces y los botones */
        .menu-colapsable {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .nav-enlaces {
          display: flex;
          gap: 2rem;
          list-style: none;
          margin: 0;
          padding: 0;
          align-items: center;
        }

        .btn-hamburguesa {
          display: none; /* Oculto por defecto en computadoras */
          background: none;
          border: none;
          font-size: 2rem;
          cursor: pointer;
          color: #0f172a;
          padding: 0;
        }

        /* 📱 ESTILOS PARA CELULARES Y TABLETS (Pantallas menores a 1024px) */
        @media (max-width: 1024px) {
          .btn-hamburguesa {
            display: block; /* Mostramos el botón de hamburguesa */
          }

          .menu-colapsable {
            display: none; /* Ocultamos la barra horizontal por defecto */
            flex-direction: column;
            position: absolute;
            top: 100%; /* Se coloca justo debajo de la franja blanca */
            left: 0;
            width: 100%;
            background-color: #ffffff;
            padding: 2rem 0;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            gap: 1.5rem;
          }

          /* Cuando damos clic y el estado cambia a true, mostramos el menú */
          .menu-colapsable.abierto {
            display: flex;
          }

          .nav-enlaces {
            flex-direction: column; /* Convertimos la fila en una columna */
            gap: 1.5rem;
            width: 100%;
            text-align: center;
          }
        }
      `}</style>

      <nav className="nav-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img src="/logo.png" alt="Logo Conectando Desaparecidos" style={{ width: '45px', height: 'auto' }} />
          <Link href="/" onClick={cerrarMenu} style={{ textDecoration: 'none', color: 'black', display: 'flex', flexDirection: 'column', lineHeight: '1.1' }}>
            <span style={{ fontWeight: '900', fontSize: '1.1rem' }}>Conectando</span>
            <span style={{ fontWeight: '900', fontSize: '1.1rem' }}>Desaparecidos</span>
          </Link>
        </div>

        <button className="btn-hamburguesa" onClick={() => setMenuAbierto(!menuAbierto)}>
          {menuAbierto ? '✖' : '☰'}
        </button>

        <div className={`menu-colapsable ${menuAbierto ? 'abierto' : ''}`}>
          
          <ul className="nav-enlaces">
            <li>
              <Link href="/busqueda" style={obtenerEstiloEnlace('/busqueda')} onClick={cerrarMenu}>
                Buscar
              </Link>
            </li>
            <li>
              <Link href="/fichasDeBusqueda" style={obtenerEstiloEnlace('/fichasDeBusqueda')} onClick={cerrarMenu}>
                Fichas de Búsqueda
              </Link>
            </li>
            <li>
              <Link href="/formulario" style={obtenerEstiloEnlace('/formulario')} onClick={cerrarMenu}>
                Crear Ficha de busqueda
              </Link>
            </li>
            <li>
              <Link href="/hallazgos" style={obtenerEstiloEnlace('/hallazgos')} onClick={cerrarMenu}>
                Hallazgos
              </Link>
            </li>
            {usuario.id && (
              <li>
                <Link href="/crearHallazgo" style={obtenerEstiloEnlace('/crearHallazgo')} onClick={cerrarMenu}>
                  Crear hallazgo
                </Link>
              </li>
            )}
            <li>
              <Link href="/reportes" style={obtenerEstiloEnlace('/reportes')} onClick={cerrarMenu}>
                Reportes
              </Link>
            </li>
            {usuario.id && (
              <li>
                  <Link href="/crearReporte" style={obtenerEstiloEnlace('/crearReporte')} onClick={cerrarMenu}>
                  Crear Reporte
                  </Link>
              </li>
            )}
            {usuario?.rol == 'administrador' && (
              <li>
                  <Link href="/estadisticas" style={obtenerEstiloEnlace('/estadisticas')} onClick={cerrarMenu}>
                  Estadisticas
                  </Link>
              </li>
            )}
          </ul>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}>
              {usuario.id ? (
                <button 
                  onClick={handleLogout}
                  style={{ 
                    backgroundColor: '#0f172a',
                    color: '#ffffff', 
                    border: 'none',
                    padding: '0.6rem 1.2rem', 
                    borderRadius: '6px', 
                    fontWeight: 'bold',
                    fontSize: '0.95rem',
                    cursor: 'pointer'
                  }}
                >
                  Cerrar sesión
                </button>
              ) : (
                <Link href="/login" onClick={cerrarMenu} style={{ 
                  backgroundColor: '#a30808',
                  color: '#ffffff', 
                  padding: '0.6rem 1.5rem', 
                  borderRadius: '6px', 
                  textDecoration: 'none', 
                  fontWeight: 'bold',
                  fontSize: '0.95rem'
                }}>
                  Iniciar Sesion
                </Link>
              )}
          </div>
        </div>
      </nav>
    </>
  );
};