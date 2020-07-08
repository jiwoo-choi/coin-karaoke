const express = require('express')
const app = express()
const server = require('http').createServer();
const portNo = 3001
server.listen(portNo, () => {
    console.log("서버 실행!")
})


const socketio = require('socket.io')
const io = socketio.listen(server)
// 세션이 존재해서 세션별로 나눠야합니다.

io.on('connection', (socket) => {

    console.log('사용자 접속', socket.client.id);

    socket.on('add-song', (msg) => {
        io.emit('add-song', msg);
    })

    socket.on('priority-add-song', (msg) => {
        io.emit('priority-add-song', msg);
    })

    socket.on('play-song', (msg) => {
        io.emit('play-song', msg);
    })

    socket.on('cancel-song', (msg) => {
        io.emit('cancel-song', msg);
    })

})