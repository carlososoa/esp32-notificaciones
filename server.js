const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json()); // Para leer JSON del ESP32

// Servimos el archivo index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta para recibir notificaciones del ESP32
app.post('/api/notificar', (req, res) => {
    const mensaje = req.body.mensaje || 'Mensaje sin contenido';

    console.log("🔔 Notificación del ESP32:", mensaje);

    // Enviar a todos los clientes conectados
    io.emit('nueva-notificacion', { mensaje });

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
