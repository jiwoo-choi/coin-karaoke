//소켓 연결하는 부분

import socektio from 'socket.io-client'

interface CoinKaraokeSocketConnectable {
    // 곡 추가
    addSong:(videoId:string,title: string)=>void;
    // 우선예약
    priortyAddSong:(videoId:string,title: string)=>void;
    // 시작
    playSong:(videoId:string,title: string)=>void;
    cancelSong:()=>void;
}

type eventType = 'add-song' | 'priority-add-song' |  'play-song' | 'cancel-song'
type responseType = { videoId : string, title: string }

export class KaraokeSenderSession implements CoinKaraokeSocketConnectable {

    private socket?: SocketIOClient.Socket;

    constructor(socket : SocketIOClient.Socket) {
        this.socket = socket;
    }

    addSong (videoId: string,title: string) {
        this.socket?.emit(
            'add-song',
            {
                title:title,
                videoId: videoId
            }
        )
    }

    priortyAddSong (videoId: string,title: string) {
        // 우선예약.
        this.socket?.emit(
            'priority-add-song',
            {
                title:title,
                videoId: videoId
            }
        )
    }

    playSong (videoId: string, title: string) {
        //우선예약 후 스타트.
        //아니면 그냥 예약되어있는거 스타트.
        this.socket?.emit(
            'play-song',
            {
                title:title,
                videoId: videoId
            }
        )
    }

    cancelSong () {
        this.socket?.emit(
            'cancel-song'
        )
    }
    
}


export class KaraokeReceiverSession  {

    //subscribe 
    //reducer처리. 
    //add처리?
    private socket?: SocketIOClient.Socket;

    constructor(socket : SocketIOClient.Socket) {
        this.socket = socket;
    }

    subscribe( 
        onAddsong : (data: responseType)=>void, 
        onPriorityAddSong: (data: responseType)=>void,
        onPlaySong: (data: responseType)=>void,
        onCancel: ()=>void,
        ) {

        this.socket?.on('get-add-song', (data: responseType) => {
            onAddsong(data);
        })

        this.socket?.on('get-priority-add-song', (data: responseType) => {
            onPriorityAddSong(data);
        })

        this.socket?.on('get-play-song', (data: responseType) => {
            onPlaySong(data);
        })

        this.socket?.on('get-cancel-song', () => {
            onCancel();
        })

    }


}