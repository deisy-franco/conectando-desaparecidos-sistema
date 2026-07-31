import cors from "cors";
import express from "express";

import { healthRouter } from "./routes/health.routes";

const app = express();

const frontendUrl =
  process.env.FRONTEND_URL ?? "http://localhost:3000";

// Evita mostrar información innecesaria sobre Express.
app.disable("x-powered-by");

// Permite solicitudes desde el frontend configurado.
app.use(
  cors({
    origin: frontendUrl,
    credentials: true,
  })
);

// Permite recibir JSON en las solicitudes.
app.use(express.json({ limit: "10mb" }));

// Ruta principal.
app.get("/", (_request, response) => {
  response.status(200).json({
    nombre: "Conectando Desaparecidos API",
    version: "1.0.0",
  });
});

// Ruta utilizada para validar que el servidor funciona.
app.use("/api/health", healthRouter);

// Respuesta para rutas inexistentes.
app.use((_request, response) => {
  response.status(404).json({
    error: "Ruta no encontrada",
  });
});

export default app;