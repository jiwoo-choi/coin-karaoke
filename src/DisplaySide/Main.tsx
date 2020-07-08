import React from 'react';
import { debounceTime, distinctUntilChanged,  flatMap } from 'rxjs/operators';
import { Subject, Observable, Subscription } from 'rxjs';
import Cell from './Cell';
import Table from './Table';
import styled from 'styled-components'
// import Player, {YouTubePlayer} from 'youtube-player';
import { Container, Draggable, OnDropCallback, DropResult } from 'react-smooth-dnd';
import socektio from 'socket.io-client'
import { KaraokeReceiverSession } from '../ControlSide/SocketConnector';

import { QRCode ,ErrorCorrectLevel, QRNumber, QRAlphaNum, QR8BitByte, QRKanji } from "qrcode-generator-ts/js";

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


const CONTAINER = styled.div`
    display:flex;
    flex-direction:column;
    height:100vh;
`
const VIDEOAREA = styled.div`
    flex : 0.5;
    background-color:red;
`

const SEARCHAREACONTAINER = styled.div`
    flex:0.5;
    background-color:green;
`

const SEARCHAREA = styled.div`
    display:flex;
    flex-direction:row;
    max-width:800px;
    margin: 20px auto;
`
const INPUT = styled.input`
    padding:15px;
    width:70%;
    font-size:1.3rem;
    border-radius:10px;
    border: 2px solid grey;     
    outline: none;
    transition: 0.5s;
    flex:1;
    margin-right:10px;

    &:focus {
        border: 2px solid black;     
    }
`

const BUTTON = styled.button`
    padding:15px;
    width:120px;
    border:unset;
    outline:none;
    font-size:1.3rem;
    background-color:#00b865;
    border-radius:10px;
    color:white;
    transition: 0.2s;
    &:hover {
        background-color:#2e8a60;
    }
`

//플레이어 버튼 스타일
const PLAYERBUTTONSTYLE = styled.button`
    
`
//예약버튼스타일
const PLAYERBUTTONSTYLE1 = styled.button`
`

//예약취소는 어디에?
//예약

// const SEARCH = () => {
//     return(

//     )
// }
export class Main extends React.Component<{}, {search:string, debounced:YoutubeResult, qrcode: string}>{

    onSearch$!: Subject<string>;
    subscription!: Subscription;
    queue: string[] = [];
    karaokeSession?: KaraokeReceiverSession;
    // player!: YouTubePlayer;

    constructor(props: {}){
        super(props);

        this.state = {
            search: '',
            debounced: {} as YoutubeResult,
            qrcode: '',
        };
        this.onSearch$ = new Subject<string>()
        this.onSearch = this.onSearch.bind(this);

        // const socket = socektio.connect('http://localhost:3001');
        
        // var tag = document.createElement('script');
        // tag.src = "https://www.youtube.com/iframe_api";
        // var firstScriptTag:HTMLScriptElement = document.getElementsByTagName('script')[0] as HTMLScriptElement;
        // let a = firstScriptTag.parentNode as Node & ParentNode
        // a.insertBefore(tag, firstScriptTag);

    }



    // addSong(id: string){
    //     this.queue.push(id)
    //     //if player is not stopped and nothing started yet.
    //     //we need to start again!
    // }

    // nextSong(player : YouTubePlayer){
    //     let nextItem = this.queue.shift();
    //     if (nextItem) {
    //         player.loadVideoById(nextItem);
    //         player.playVideo();
    //     }

    // }

    // play(player : YouTubePlayer){
    //     let state = player.getPlayerState() as unknown as Promise<any>
    //     state.then(
    //         (data) => {

    //             if (data === 2) {
    //                 player.playVideo();
    //             } else {
    //                 this.nextSong(player)
    //             }
    //         }

    //     )
    // }
    

    componentDidMount(){

        this.karaokeSession = new KaraokeReceiverSession('https://97568f1b9300.ngrok.io');
        this.karaokeSession?.subscribe(
            data=>console.log(data),
            data=>console.log(data),
            data=>console.log(data),
            ()=>console.log("cancel")
        )

        let qrCode = new QRCode();
        qrCode.setErrorCorrectLevel(ErrorCorrectLevel.M);
        qrCode.setTypeNumber(4);
        qrCode.addData("http://ce2f591ced7a.ngrok.io/mobile");
        qrCode.make();
        this.setState({qrcode : qrCode.toDataURL()})

        //돈넣기.
        //하루에 3곡제한.
        //3곡끝나면 마지막에 이거넣어주기.

        // this.player = Player('player', {
        //     playerVars : {
        //         controls: 0,
        //         disablekb: 0,
        //     }
        // });
        // this.nextSong(this.player);

        // this.player.on('stateChange', (event)=> {
        //     if (event.data === 0) {
        //         this.nextSong(this.player);
        //     }

        //     if (event.data === 2) {
        //         // this.player.playVideo();
        //     }
        // })
        // 

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

        //bind();
        //https://www.googleapis.com/youtube/v3/search?&q=%EC%B2%98%EC%9D%8C%EC%97%94%EC%82%AC%EB%9E%91%EC%9D%B4%EB%9E%80%EA%B2%8C&part=snippet&channelId=UCDqaUIUSJP5EVMEI178Zfag
        //key=AIzaSyChBgNhZpddKx-oIqKQZpLZfqLQ2bhcYM4
        //q= query
        //key=AIzaSyChBgNhZpddKx-oIqKQZpLZfqLQ2bhcYM4
    }

    componentWillUnmount() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    //시작하기
    //우선예약

    onSearch(e: React.FormEvent<HTMLInputElement>) {
        const search = e.currentTarget.value;
        this.setState({ search });
        this.onSearch$.next(search);
    }

    drop(dropResult : DropResult){
        const { removedIndex, addedIndex, payload, element } = dropResult;
        console.log(dropResult)
    }

    
    render(){
        const { search, debounced } = this.state;
        return(
            <CONTAINER>
                <VIDEOAREA>
                {/* <video width="640" height="360" id="player1" preload="none">
                    <source type="video/youtube" src="http://www.youtube.com/watch?v=nOEw9iiopwI" />
                </video> */}
                <div id="player"></div>
                </VIDEOAREA>
{/* 
                <button onClick={()=>{this.play(this.player)}}>
                    시작하기
                </button>
                <button onClick={()=>{this.play(this.player)}}>
                    다음곡
                </button>
                <button onClick={()=>{this.play(this.player)}}>
                    다음곡
                </button> */}


                <Container onDrop={this.drop.bind(this)}>
                    {["abc","def","abcd","efgd"].map(item => {
                        return (
                            <Draggable key={"ABC"+item}>
                                {item}
                            </Draggable>
                        );
                    })}
                </Container>



                <SEARCHAREACONTAINER>
                <img style={{width:'100px', height:'100px'}} src={this.state.qrcode}></img>

                  
                </SEARCHAREACONTAINER>

            </CONTAINER>
        )
    }

    //예약하기.

}



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