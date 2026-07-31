import "dotenv/config";

import app from "./app";

const portText = process.env.PORT ?? "3001";
const port = Number.parseInt(portText, 10);

if (Number.isNaN(port)) {
  throw new Error("La variable PORT debe contener un número válido.");
}

app.listen(port, () => {
  console.log(`API ejecutándose en http://localhost:${port}`);
  console.log(`Health check: http://localhost:${port}/api/health`);
});
