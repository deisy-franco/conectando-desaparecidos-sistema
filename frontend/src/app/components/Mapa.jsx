import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useRef, useMemo } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Configuramos el ícono por defecto
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

// 1. MEJORA: Animación de vuelo al hacer clic
function ClicEnMapa({ onLocationSelect }) {
  const map = useMapEvents({
    click(e) {
      if (onLocationSelect) {
        onLocationSelect({ lat: e.latlng.lat, lng: e.latlng.lng });  
      }
      // Guardamos las coordenadas
      
      
      // ✨ Hacemos que la cámara "vuele" suavemente hacia el nuevo punto
      map.flyTo(e.latlng, map.getZoom(), {
        animate: true,
        duration: 0.5 // Medio segundo de animación
      });
    },
  });
  return null;
}

export default function Mapa({ coordenadas, setCoordenadas }) {
  const markerRef = useRef(null);

  // 2. MEJORA: Lógica para cuando el usuario suelta el pin después de arrastrarlo
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const position = marker.getLatLng();
          // Actualizamos el estado general con las nuevas coordenadas del pin soltado
          setCoordenadas({ lat: position.lat, lng: position.lng });
        }
      },
    }),
    [setCoordenadas]
  );

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: '8px', overflow: 'hidden', zIndex: 0 }}>
      <MapContainer 
        center={[coordenadas.lat, coordenadas.lng]} 
        zoom={13} 
        style={{ height: '350px', width: '100%', zIndex: 0 }}
      >
        <TileLayer 
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
        />
        
        <ClicEnMapa onLocationSelect={setCoordenadas} />
        
        <Marker 
          draggable={true} // ✨ ¡Esto hace que el pin se pueda arrastrar!
          eventHandlers={eventHandlers} // ✨ Escucha cuando terminan de arrastrarlo
          position={[coordenadas.lat, coordenadas.lng]} 
          icon={customIcon} 
          ref={markerRef}
        />
      </MapContainer>
    </div>
  );
}