import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';


// 🎨 Estilos del PDF (Son muy similares a CSS)
const styles = StyleSheet.create({
  page: { 
    padding: 40, 
    backgroundColor: '#ffffff' 
  },
  header: { 
    fontSize: 22, 
    marginBottom: 20, 
    textAlign: 'center', 
    color: '#7b1113', 
    fontWeight: 'bold' 
  },
  section: { 
    margin: 10, 
    padding: 15, 
    border: '1px solid #e2e8f0', 
    borderRadius: 8,
    backgroundColor: '#f8fafc'
  },
  title: { 
    fontSize: 14, 
    marginBottom: 10, 
    fontWeight: 'bold',
    color: '#0f172a'
  },
  row: { 
    display: 'flex', 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 8,
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: 4
  },
  text: { 
    fontSize: 12, 
    color: '#334155' 
  }
});

// 📄 Esta es la estructura física de tu documento
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PlantillaEstadisticas = ({ datos, imagenes }: { datos: any, imagenes?: any }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      
      {/* Título Oficial */}
      <Text style={styles.header}>Reporte Oficial de Conectando Desaparecidos</Text>

      {/* Sección 1: Tarjetas de Resumen */}
      <View style={styles.section}>
        <Text style={styles.title}>Resumen General</Text>
        
        <View style={styles.row}>
          <Text style={styles.text}>Total de Fichas de Búsqueda:</Text>
          <Text style={styles.text}>{datos.tarjetas?.totalFichas || 0}</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.text}>Total de Hallazgos:</Text>
          <Text style={styles.text}>{datos.tarjetas?.totalHallazgos || 0}</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.text}>Total de Reportes:</Text>
          <Text style={styles.text}>{datos.tarjetas?.totalReportes || 0}</Text>
        </View>
      </View>

      {/* Sección 2: Puedes enlistar el Top 5 de Municipios aquí como texto */}
      <View style={styles.section}>
        <Text style={styles.title}>Municipios con mayor incidencia</Text>
        {/*eslint-disable-next-line @typescript-eslint/no-explicit-any*/}
        {datos.graficaZonas?.map((zona: any, index: number) => (
            <View style={styles.row} key={index}>
                <Text style={styles.text}>{zona.name}</Text>
                <Text style={styles.text}>{zona.cantidad} casos</Text>
            </View>
        ))}
        {imagenes?.barras && (
            <Image src={imagenes.barras} style={{ marginTop: 15, borderRadius: 8 }} />
        )}
      </View>
        {/* Sección 3: Distribución por Estatus */}
      <View style={styles.section}>
        <Text style={styles.title}>Distribución por Estatus</Text>
        <View style={[styles.row, { backgroundColor: '#e2e8f0', padding: 4, borderRadius: 4 }]}>
            <Text style={[styles.text, { fontWeight: 'bold' }]}>Estatus de la persona</Text>
            <Text style={[styles.text, { fontWeight: 'bold' }]}>Total de fichas</Text>
        </View>
        {/*eslint-disable-next-line @typescript-eslint/no-explicit-any*/}
        {datos.graficaEstatus?.map((estatus: any, index: number) => (
            <View style={styles.row} key={index}>
                <Text style={styles.text}>{estatus.name}</Text>
                <Text style={styles.text}>{estatus.value}</Text>
            </View>
        ))}
        {/* ✨ AQUÍ PEGAMOS LA FOTO DE LA DONA */}
        {imagenes?.dona && (
            <Image src={imagenes.dona} style={{ marginTop: 15, borderRadius: 8 }} />
        )}
      </View>

      {/* Sección 4: Tendencia Mensual */}
      <View style={styles.section}>
        <Text style={styles.title}>Tendencia de Desapariciones por Mes</Text>
        <View style={[styles.row, { backgroundColor: '#e2e8f0', padding: 4, borderRadius: 4 }]}>
            <Text style={[styles.text, { fontWeight: 'bold' }]}>Mes del año</Text>
            <Text style={[styles.text, { fontWeight: 'bold' }]}>Casos reportados</Text>
        </View>
        {/*eslint-disable-next-line @typescript-eslint/no-explicit-any*/}
        {datos.graficaMeses?.map((mes: any, index: number) => (
            <View style={styles.row} key={index}>
                <Text style={styles.text}>{mes.mes}</Text>
                <Text style={styles.text}>{mes.cantidad}</Text>
            </View>
        ))}
        {/* ✨ AQUÍ PEGAMOS LA FOTO DE LAS LÍNEAS */}
        {imagenes?.lineas && (
            <Image src={imagenes.lineas} style={{ marginTop: 15, borderRadius: 8 }} />
        )}
      </View>
    </Page>
  </Document>
);