import React from "react";
import socektio from 'socket.io-client'
import styled from 'styled-components'
import YoutubeAPIFetch, {YoutubeResult} from '../KaraokeUtils/YoutubeDataApi'
import { Button , Search , Input, Accordion, Icon, Container} from 'semantic-ui-react'
import { Header } from 'semantic-ui-react'
import Collapse from './Arccodian'
import {KaraokeSenderSession, KaraokeReceiverSession} from '../KaraokeUtils/SocketConnector'
import { SocketControllable } from "../App";
import { withRouter, RouteComponentProps } from 'react-router-dom'

const INPUT_CONTAINER = styled.div`
    display:flex;
    margin:20px;
`

class ControlMain extends React.Component<SocketControllable & RouteComponentProps,{searchResult: YoutubeResult, searchString:string}> {
    private karaokeSession? : KaraokeSenderSession;

    constructor(props:SocketControllable & RouteComponentProps){

        super(props);

        // const socket = socektio.connect('http://97568f1b9300.ngrok.io');

        this.state = {
            searchResult: {} as YoutubeResult,
            searchString: '',
        };
    }

    componentDidMount(){
        this.karaokeSession = new KaraokeSenderSession(this.props.socket);
        // this.karaokeSession = new KaraokeSenderSession('http://ec2-user@ec2-3-23-61-166.us-east-2.compute.amazonaws.com:3000');
    }


    onSearch(e: React.FormEvent<HTMLInputElement>) {
        const search = e.currentTarget.value;
        this.setState({ searchString: search });
    }

    render(){
        return(
            <div style={{overflow:'scroll'}}>
                <div>
                    <INPUT_CONTAINER>
                        {/* <INPUT type="text" placeholder={"노래를 입력해주세요."} value={this.state.searchString} onChange={this.onSearch.bind(this)}/> */}
                        <Input 
                            icon='search' 
                            placeholder='Search...' 
                            value={this.state.searchString}
                            onChange={this.onSearch.bind(this)}
                            style={{
                                flex:1,
                                marginRight:'15px',
                        }}/>
                        <Button onClick={() => {
                            YoutubeAPIFetch(this.state.searchString).then( response => this.setState({ searchResult : response}))
                        }}>검색하기</Button>
                        {/* <BUTTON onClick={()=>{ YoutubeAPIFetch(this.state.searchString).then( response => this.setState({ searchResult : response}))}}> 검색하기</BUTTON> */}
                    </INPUT_CONTAINER>
                    
                    


                    {/* <Container style={{
                        margin:'20px'
                    }}> */}

                  
                    {
                        


                        this.state.searchResult.items?.map( (value) => {
                            return (
                                    <Collapse title={value.snippet.title}>
                                        <div
                                                style= {{
                                                    display:'flex',
                                                    flexDirection:'row',
                                                    justifyContent:'space-around'
                                            }}>
                                                <Button onClick={()=>{this.karaokeSession?.playSong(value.id.videoId, value.snippet.title)}} icon>
                                                    <Icon name='play' /> 시작하기 
                                                </Button>   
                                                <Button onClick={()=>{this.karaokeSession?.addSong(value.id.videoId, value.snippet.title)}} icon>
                                                    <Icon name='clock outline' /> 예약하기 
                                                </Button>
                                                <Button onClick={()=>{this.karaokeSession?.priortyAddSong(value.id.videoId, value.snippet.title)}} icon>
                                                    1<Icon name='clock outline' /> 우선예약 
                                                </Button>
                                        </div>
                                    </Collapse>
                            )
                            // let a = new RegExp('(?<=\])\s.+\s-\s.+?\s');
                            // let b = a.exec(value.snippet.title)

                            // if (b) {
                            //     const c = b[0].split('-')
                            //     return (
                            //         <>
                            //         <div style={{fontSize:'1.2rem'}}>
                            //             {c[0]}
                            //         </div>
                            //         <div style={{fontSize:'0.9rem'}}>
                            //             {c[1]}
                            //         </div>
                            //         </>
                            //     )
                            // } else {
                            //     return(
                            //     )
                            // }
                           
                        })
                    }

                </div>
            </div>
            
        )
    }
}

export default withRouter(ControlMain)