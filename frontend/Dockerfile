# Ubicación en tu proyecto: frontend/Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copiar dependencias e instalarlas primero para aprovechar la caché de Docker
COPY package*.json ./
RUN npm install

# Copiar el resto del código de la app Expo
COPY . .

# Puertos de Metro bundler y Expo DevTools
EXPOSE 8081 19000 19001 19002

# Inicia Expo en modo LAN para que tu teléfono en la misma red Wi-Fi pueda conectarse
CMD ["npx", "expo", "start", "--host", "lan"]
