// websocket-server.js
const WebSocket = require('ws');
const http = require('http');
const url = require('url');

const wss = new WebSocket.Server({ noServer: true });
const clients = new Set();

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);

  // Rota para enviar mensagens via POST
  if (req.method === 'POST' && parsedUrl.pathname === '/send') {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        console.log('🔔 Enviando para extensões:', data.message);

        // Broadcast para todos os clientes conectados
        for (const client of clients) {
          if (client.readyState === WebSocket.OPEN) {
            client.send(data.message);
          }
        }

        res.writeHead(200);
        res.end('Mensagem enviada para todos os WebSockets.');
      } catch (e) {
        res.writeHead(400);
        res.end('Erro ao processar mensagem');
      }
    });
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, function done(ws) {
    clients.add(ws);
    console.log('🧩 Extensão conectada');

    ws.on('close', () => {
      clients.delete(ws);
      console.log('❌ Extensão desconectada');
    });

    ws.send('📡 Conectado com sucesso ao WebSocket!');
  });
});

server.listen(3001, () => {
  console.log('🚀 WebSocket + HTTP server ouvindo na porta 3001');
});
