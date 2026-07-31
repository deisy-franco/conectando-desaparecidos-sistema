# ==========================================
# ETAPA 1: INSTALAR Y COMPILAR
# ==========================================
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY tsconfig.json eslint.config.mjs ./
COPY src ./src

RUN npm run build


# ==========================================
# ETAPA 2: EJECUTAR EN PRODUCCIÓN
# ==========================================
FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./

RUN npm ci --omit=dev && npm cache clean --force

COPY --from=build /app/dist ./dist

EXPOSE 3001

CMD ["npm", "start"]