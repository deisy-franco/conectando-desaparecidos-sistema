import 'dotenv/config';

import app from './app';

const portText = process.env.PORT ?? '3001';
const port = Number.parseInt(portText, 10);

if (Number.isNaN(port)) {
    throw new Error(
        'La variable PORT debe contener un número válido.'
    );
}

app.listen(port, '0.0.0.0', () => {
    console.log(`API ejecutándose en el puerto ${port}`);
    console.log(
        `Health check: http://localhost:${port}/api/health`
    );
});