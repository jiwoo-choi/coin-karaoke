
// import express = require('express');
// const app = express()

import * as http from 'http'
import socketio from 'socket.io'

const server = http.createServer();
const portNo = 3000

const io = socketio.listen(server);

server.listen(portNo, () => {
    console.log("서버 실행!");
})


type waitingListType = {
    [key: string]: {
        time: number,
        socketId : string,
    }
}

type joinedListType = {
    [key: string]: {
        // 해당 소켓 접속.
        time: number,
        // 소켓 ID
        socketId : string,
        // 랜덤으로 배정된 고유 pageID 
        pageId : string
    }
} 

let waitingList : waitingListType = {};
let joinedList: joinedListType  = {};

io.onconnection( (socket: SocketIO.Socket) => {
    console.log(socket.client.id)
})