const express = require('express');
const app = express().use(express.json());
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    path: '/socket',
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
    pingTimeout: 1000,
    pingInterval: 2000
});

const PORT = process.env.PORT || 3001;

const rooms = new Map();

const router = express.Router();

router.get('/rooms/:roomId', (req, res) => {
    const roomId = req.params.roomId;
    const room = rooms.get(roomId);
    const data = {
        users: [],
        messages: []
    }
    if (room) {
        data.users = [...room.get('users').values()];
        data.messages = [...room.get('messages').values()]
    }
    res.json(data);
});

router.post('/rooms', (req, res) => {
    const { roomId } = req.body;
    if (!rooms.has(roomId)) {
        rooms.set(roomId, new Map([
            ['users', new Map()],
            ['messages', [
                {
                    userName: "admin",
                    text: "Welcome to the new room!",
                    admin: true
                },
            ]]
        ]));
    }
    res.send();
});

app.use('/api', router); 

server.listen(PORT, (err) => {
    if (err) throw Error(err);
    console.log(`Server is running at ${PORT}`);
});

io.on("connection", (socket) => {
    socket.on('ROOM:JOIN', ({ roomId, userName }) => {
        socket.join(roomId);
        rooms.get(roomId).get('users').set(socket.id, userName);
        const users = [...rooms.get(roomId).get('users').values()];
        io.to(roomId).emit('ROOM:SET_USERS', users);
        socket.to(roomId).emit('ROOM:NEW_MESSAGE', {
            roomId: roomId,
            userName: "admin",
            text: `${userName} entered the room`
        });
    });

    socket.on('ROOM:NEW_MESSAGE', (message) => {
        const { roomId, ...messageData } = message;
        rooms.get(roomId).get('messages').push(messageData);
        io.to(roomId).emit('ROOM:NEW_MESSAGE', messageData);
    });

    socket.on("disconnect", () => {
        rooms.forEach((value, roomId) => {
            const disconnectedUser = value.get('users').get(socket.id);
            if (disconnectedUser) {
                value.get('users').delete(socket.id);
                const users = [...value.get('users').values()];
                io.to(roomId).emit('ROOM:SET_USERS', users);
                socket.to(roomId).emit('ROOM:NEW_MESSAGE', {
                    roomId: roomId,
                    userName: "admin",
                    text: `${disconnectedUser} left the room`
                });
                if (users.length === 0) rooms.delete(roomId);
            }
        });
    });
});
