const express = require('express')
const app = express()
const server = require('http').createServer();
const portNo = 3000
server.listen(portNo, () => {
    console.log("서버 실행!")
})


const socketio = require('socket.io')
const io = socketio.listen(server)


let queue = [];
function concurrentQueue() {
    this.queue.push()
}

function exec() {
    // go next
    //goNext()
    // go next
    // new Promise().then(resposve. then( ))
    // new Promise()
    // .then( resolve => })
}




// 세션이 존재해서 세션별로 나눠야합니다.
let waitingUser = {}
//만약 Joine되었으면 waiting user에서 join 유저로 이동합니다.
let joinedUser = {}



/**
 * 
 * socket => 특정 socket에만 보내는것.
 * io => socketio에 전부 보내는것.
 * 
 * socket.id
 * //in & of 특정 구분...
 */

// console.log(joinedUser, waitingUser)
// new Promise<>
// 어떻게대응할것인가?
// 큐를 대응? emit? 어떻게? async? 순서대로?
// if (user) {
//     // 이미 이 유저는 들어가있습니다 새로운 룸으로 업데이트해줘야합니다.

// } else {
//     // 이 유저는 처음들어가는것입니다.
//     joinedUser[id] = { time: waitingUser[id], roomNumber }
// }
// 
//check prev.
//
// socket.join('room' + nextRoomId);


function removeFromObject(target, total){ 
    return Object.keys(total).reduce( (prev,curr) => {
        if (curr === target) {
            return prev;
        } else {
            prev[curr] = total[curr];
            return prev;
        }
    }, {})
}

//Promise Stream

// 큐 대응하기? this.queue = [] Stream. concurently 
// concurently safe
//this queue go next.
//emit...

//concurrentQueue..
//goNext(goNext)
function removeFromWaitingList(socket) {
    //update waiting user
    let target = socket.client.id;
    waitingUser = removeFromObject(target, waitingUser)
    io.emit('waiting-user-number', Object.keys(waitingUser).length)
}

function addToWaitingList(socket) {
    let target = socket.client.id;

    waitingUser[target] = Date.now();
    io.emit('waiting-user-number', Object.keys(waitingUser).length)
}

function addToJoinRoomList(socket, roomNumber){
    let target = socket.client.id;
    if (joinedUser[target]) {
        socket.leave('room' + joinedUser[target].roomNumber);
        joinedUser[target] = { time: joinedUser[target].time, roomNumber }
    } else {
        joinedUser[target] = { time: waitingUser[target], roomNumber }
        removeFromWaitingList(socket)
    }
    socket.join('room' + roomNumber);
    io.emit('joined-user-number',Object.keys(joinedUser).reduce((prev, curr) => { 
        prev.push(joinedUser[curr].roomNumber)
        return prev
    }, []))
}


function removeFromJoinRoomList(socket){
    let target = socket.client.id;
    if (joinedUser[target]) {
        //leave room
        socket.leave('room' + joinedUser[target].roomNumber);
        joinedUser = removeFromObject(target, joinedUser)
        addToWaitingList(socket)
        io.emit('joined-user-number', Object.keys(joinedUser).reduce((prev, curr) => { 
            prev.push(joinedUser[curr].roomNumber)
            return prev
        }, []))
    } else {
        //nothing
    }
}

io.on('connection', (socket) => {

    console.log('사용자 접속', socket.client.id);
    console.log("연결되었습니다", socket.client.id, waitingUser)
    addToWaitingList(socket);

    // disconnect 
    socket.on('disconnect' , (data) => {  
        removeFromJoinRoomList(socket)
        removeFromWaitingList(socket);
        console.log("끊어졌습니다", socket.client.id)
    })

    //방들어간경우 
    socket.on('join-room', ({roomId, id}) => {
        addToJoinRoomList(socket, {roomId, id});
    })

    //방을 떠난 경우..
    socket.on('leave-room', () => {
        removeFromJoinRoomList(socket)
    })

    //최초 현재 데이터 업데이트용으로...
    socket.on('refresh-request', () => {
        socket.emit('refresh-response', 
            Object.keys(waitingUser).length, 
            Object.keys(joinedUser).reduce((prev, curr) => { 
                prev.push(joinedUser[curr].roomNumber)
                return prev
            }, [])
        );
    })


    //누군가 add-song을 보내면 (아무 모바일이나...)
    socket.on('add-song', (msg) => {
        //그걸 소켓 id를 구분하여... 그쪽에게만 소켓에게만 보내준다.
        //받은 소켓 아이디를 기반으로 구분시켜준다..
        io.sockets.in('room' + msg.roomId).clients.emit('get-add-song', msg);
    })
    
    socket.on('priority-add-song', (msg) => {
        io.sockets.in('room', msg.roomId).emit('get-priority-add-song', msg)
    })

    socket.on('play-song', (msg) => {
        io.sockets.in('room', msg.roomId).emit('get-play-song', msg)
    })

    socket.on('cancel-song', (msg) => {
        io.sockets.in('room', msg.roomId).emit('get-cancel-song', msg)
    })

})
