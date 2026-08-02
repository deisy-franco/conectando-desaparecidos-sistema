import { Router } from "express";

export const healthRouter = Router();

healthRouter.get("/", (_request, response) => {
  response.status(200).json({
    status: "ok",
    servicio: "conectando-desaparecidos-api",
    mensaje: "El backend está funcionando",
    fecha: new Date().toISOString(),
  });
});

export default healthRouter;