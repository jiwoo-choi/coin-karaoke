import React from 'react';
import Player  from 'youtube-player';
import { YouTubePlayer } from "youtube-player/dist/types"
import { Container, Draggable, DropResult } from 'react-smooth-dnd';
import { KaraokeReceiverSession } from '../KaraokeUtils/SocketConnector';

import { QRCode ,ErrorCorrectLevel } from "qrcode-generator-ts/js";
import { SocketControllable } from '../App';
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { Icon, Label, Segment, Button, Header, Divider } from 'semantic-ui-react'

//disconnect.


interface YoutubeResult {
    items : {
        kind: string,
        etag: string,
        id: {
            kind: string,
            videoId: string
        },
        snippet: {
            title: string,
            thumbnails: {
                default : {
                    url : string,
                    width: number,
                    height: number
                }
            }
        }
    }[]
}


//예약취소는 어디에?
//예약

// const SEARCH = () => {
//     return(

//     )
// }

type responseType = { videoId : string, title: string }
class Main extends React.Component<SocketControllable & RouteComponentProps<{id:string}>, {queue:responseType[], qrcode: string}>{

    queue: string[] = [];
    karaokeSession?: KaraokeReceiverSession;
    player!: YouTubePlayer;

    constructor(props: SocketControllable & RouteComponentProps<{id:string}>){
        super(props);

        this.state = {
            qrcode: '',
            queue:[] as responseType[]
        };
    }

    // ---- 플레이어 ---- //

    nextSong(player : YouTubePlayer){
        let nextItem = this.queue.shift();
        if (nextItem) {
            player.loadVideoById(nextItem);
            player.playVideo();
        }
    }

    play(player : YouTubePlayer){
        let state = player.getPlayerState() as unknown as Promise<any>
        state.then(
            (data) => {
                if (data === 2) {
                    player.playVideo();
                } else {
                    this.nextSong(player)
                }
            }
        )
    }

    // 취소하기
    cancel(player : YouTubePlayer) {
        // player.loadVideoById('');
        player.stopVideo();
    }


    // --- 예약내역 관리 --- //

    removeSongAt(index: number){
        const slice1 = this.state.queue.slice(0,index)
        const slice2 = this.state.queue.slice(index,this.state.queue.length)
        this.setState({ queue : slice1.concat(slice2)})
    }

    addSong(data: responseType){
        const newQueue = this.state.queue;
        newQueue.push(data);
        this.setState({ queue : newQueue})
    }

    addSongAtFirst(data: responseType) {
        const newQueue = [ data ].concat(this.state.queue)
        this.setState({ queue : newQueue})
    }

    componentDidMount(){

        this.karaokeSession = new KaraokeReceiverSession(this.props.socket);

        let qrCode = new QRCode();
        qrCode.setErrorCorrectLevel(ErrorCorrectLevel.M);
        qrCode.setTypeNumber(4);
        qrCode.addData("http://localhost:3000/remote/"+this.props.match.params.id);
        qrCode.make();
        this.setState({qrcode : qrCode.toDataURL()})


        this.karaokeSession
        .subscribe(
            data => this.addSong(data),
            data => this.addSongAtFirst(data),
            data => console.log("play"),
            () => console.log("adfadf")
        )

        this.player = Player('player', {
            playerVars : {
                controls: 0,
                disablekb: 0,
            }
        });

        this.player.on('stateChange', (event)=> {
            if (event.data === 0) {
                this.nextSong(this.player);
            }
            if (event.data === 2) {
                // 멈출수없어!
                // this.player.playVideo();
            }
        })
    }

    componentWillUnmount() {
    }


    drop(dropResult : DropResult){ 
        const { removedIndex, addedIndex } = dropResult;
        if (removedIndex !== null && addedIndex !== null) {
            let queueM = this.state.queue;
            let temp = queueM[removedIndex];
            queueM[removedIndex] = queueM[addedIndex];
            queueM[addedIndex] = temp;
            this.setState({queue: queueM})
        }
    }

    renderedItems(value:responseType[]) {
        return value.map( (element, index) => {
            return (           
                <Draggable key={"SONG_"+index}>
                    <Label size={"large"} style={{ marginBottom:'10px'}}>
                        {index+1} .  {element.title}
                        <Icon name='delete' link onClick={()=>{this.removeSongAt(index)}}/>
                    </Label>
                </Draggable>
            )
        })
    }

    
    render(){
        //
        
        return(
            <div>
                <div style={{display:"flex", justifyContent:"center",alignItems:'center',flexDirection:"column"}}>
                    <div id="player" style={{margin:'auto'}}></div>
                    <Button.Group horizontal labeled icon>
                        <Button icon='play' content='시작하기' onClick={()=>{this.play(this.player)}}/>
                        <Button icon='stop' content='취소' onClick={()=>{this.cancel(this.player)}} />
                    </Button.Group>
                </div>
                <Divider />
                <div style={{display:"flex",flexDirection:"row", margin:'0 10px'}}>
                    <div style={{flex:1, marginRight:'10px'}}>
                        <Header> 예약 목록 </Header>
                        <Label color='blue' pointing='below'>드래그 해서 예약 순서를 옮겨보세요!</Label>
                        <Container onDrop={this.drop.bind(this)}>
                        { this.renderedItems(this.state.queue)}
                        </Container>
                    </div>

                    <div>
                    <Segment padded>
                    <Label attached='top'>노래 검색 및 예약하기</Label>
                        <img style={{width:'150px', height:'150px'}} src={this.state.qrcode}></img>
                    </Segment>
                    </div>
                </div>
            </div>
        )
    }

    //예약하기.

}
export default withRouter(Main);


// this.onSearch$ = new Subject<string>()
// this.onSearch = this.onSearch.bind(this);
// console.log(this.props)

//   <SEARCHAREA>
//                         <INPUT type="text" placeholder={"노래를 입력해주세요."} value={search} onChange={this.onSearch} />
//                         <BUTTON onClick={()=>{
//                             const optionParams = {
//                                 key : "AIzaSyCwZNP4VjDo9CzCgGRsBjkvPjbXvdEjEY0",
//                                 q: this.state.search,
//                                 channelId: "UCDqaUIUSJP5EVMEI178Zfag",
//                                 part:"snippet"
//                             }
//                             let url = "https://www.googleapis.com/youtube/v3/search?";
                            
//                             for(let [key, value] of Object.entries(optionParams)) {
//                                 url+=key+"="+ value+"&";
//                             }
//                             url=url.substr(0, url.length-1);

//                             fetch(url)
//                             .then( response =>  response.json() )
//                             .then( jsonResponse => { 
//                                         this.setState({debounced: jsonResponse})
//                             })

//                         }}>검색하기</BUTTON>
//                     </SEARCHAREA>
//                     <div>
//                     <Table>
//                         {
//                             debounced.items?.map( value => {
//                                 return <Cell onClick={(id)=>{}} title={value.snippet.title} id={value.id.videoId} ></Cell>
//                             })
//                         }
//                     </Table>
        
//                     {/* <div>debounced value: {debounced.items}</div> */}
//                     </div>


        // this.subscription = this.onSearch$.pipe(
        //     debounceTime(300),
        //     distinctUntilChanged(),
        //     flatMap( (value) => {
        //             return new Observable<YoutubeResult>( subscribe => {

        //                 const optionParams = {
        //                     key : "AIzaSyCwZNP4VjDo9CzCgGRsBjkvPjbXvdEjEY0",
        //                     q: value,
        //                     channelId: "UCDqaUIUSJP5EVMEI178Zfag",
        //                     part:"snippet"
        //                 }

        //                 let url = "https://www.googleapis.com/youtube/v3/search?";

        //                 for(let [key, value] of Object.entries(optionParams)) {
        //                     url+=key+"="+ value+"&";
        //                 }
        //                 url=url.substr(0, url.length-1);

        //                 fetch(url)
        //                 .then( response =>  response.json() )
        //                 .then( jsonResponse => { 
        //                     subscribe.next(jsonResponse) 
        //                     subscribe.complete()
        //                 })
        //                 .catch( 
        //                     error => subscribe.error(error)
        //                 )
        //             })
        //         }
        //     )
        // ).subscribe(
        //     res=> {
        //         this.setState({debounced: res})
        //     },
        //     err=> console.log(err),
        //     ()=> {console.log("complete")}
        // )
        
        
        // .subscribe( debounced => 
        //     // 여기서 웹 리퀘스트 보내기.
        //     this.setState({ debounced })
        // );
