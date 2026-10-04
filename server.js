const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = new Server(server);
app.use(express.static('public'));
const players = {};
io.on('connection', (s) => {
  players[s.id] = { id: s.id, name: 'Piloto', state: 'menu', progress: 0, rocket: 1, speed: 1 };
  s.on('update', (d) => {
    const p = players[s.id]; if (!p || !d) return;
    p.name = String(d.name || 'Piloto').slice(0, 14);
    p.state = d.state; p.progress = +d.progress || 0;
    p.rocket = Math.max(1, Math.min(999, d.rocket | 0)); p.speed = d.speed === 2 ? 2 : 1;
  });
  s.on('disconnect', () => delete players[s.id]);
});
setInterval(() => io.emit('state', Object.values(players)), 200);
server.listen(process.env.PORT || 3000, () => console.log('Luna online listo'));
