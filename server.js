const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const morgan = require('morgan'); // 🆕 Agregado para logs HTTP

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Middleware
app.use(morgan('dev')); // 🆕 Loguea cada solicitud HTTP en consola
app.use(express.json()); // Para leer JSON del ESP32

// Página web
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API para recibir notificaciones
app.post('/api/notificar', (req, res) => {
    const NombreNegocio = req.body.NombreNegocio || 'Mensaje sin contenido';
    const Direccion = req.body.Direccion || 'Mensaje sin contenido';
    const Coordenadas = req.body.Coordenadas || 'Mensaje sin contenido';

    console.log("🔔 Notificación del ESP32:", mensaje);
    console.log("📦 Body completo:", req.body);

    // Emitir a todos los clientes conectados vía WebSocket
    const FechaHora = new Date().toISOString()
    io.emit('nueva-notificacion', { NombreNegocio, Direccion, Coordenadas, FechaHora });

    res.status(200).json({ ok: true, mensaje: "Notificación enviada a clientes" });
});

// WebSocket
io.on('connection', (socket) => {
    console.log('✅ Cliente conectado al WebSocket');

    socket.on('disconnect', () => {
        console.log('❌ Cliente desconectado');
    });
});

// Iniciar servidor
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});
