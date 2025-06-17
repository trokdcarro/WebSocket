# Dockerfile
FROM node:18

WORKDIR /app

COPY websocket-server.js .

RUN npm install ws

EXPOSE 3001

CMD ["node", "websocket-server.js"]
