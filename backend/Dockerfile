# Ubicación en tu proyecto: backend/Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copiar dependencias e instalarlas primero para aprovechar la caché de Docker
COPY package*.json ./
RUN npm install

# Copiar el resto del código del backend
COPY . .

EXPOSE 3000

# Ajustá el comando según tu script en package.json (ej. "npm start" o "node index.js")
CMD ["npm", "run", "dev"]
