// src/server.ts
import app from './app';

const PORT = 3001; 

app.listen(PORT, () => {
    console.log(`✅ Servidor API corriendo en http://localhost:${PORT}`);
});