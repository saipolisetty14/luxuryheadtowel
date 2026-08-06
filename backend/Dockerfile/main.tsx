FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

# Ensure data and uploads directories exist
RUN mkdir -p data uploads

EXPOSE 3001

CMD ["node", "server.js"]
