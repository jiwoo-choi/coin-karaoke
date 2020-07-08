//waitingroom.
//routing으로 접속하면 어떻게?

import React from "react";
import { Card, Button , Header } from "semantic-ui-react";
import styled from "styled-components";
import { SocketControllable } from "../App";
import { withRouter , RouteComponentProps } from "react-router-dom";

const CONTAINER = styled.div`
    display:flex;
    justify-content:center;
    align-items:center;
    flex-direction:column;
    margin-left:10px;
    margin-right:10px;
    margin-top:20px;
`

interface State { 
    waitingUserNumber: number;
    buttonUnavailability:boolean[];
}

class WaitingRoom extends React.Component<SocketControllable & RouteComponentProps, State> {
    
    constructor(props: SocketControllable & RouteComponentProps) {
        super(props);
        
        this.state = {
            waitingUserNumber: 0,
            buttonUnavailability:[true,true,true,true]
        }
    }


    componentDidMount(){
        this.props.socket?.on('waiting-user-number', (waitingUserNumber:number) => {

            this.setState({
                waitingUserNumber : waitingUserNumber,
            })
        })

        this.props.socket?.on('joined-user-number', (unavailable:number[]) => {

            const newUnavailbility = this.state.buttonUnavailability.reduce((prev, curr, index) => {
                prev[index] = unavailable.includes(index+1)
                return prev;
            }, this.state.buttonUnavailability)

            this.setState({ 
                buttonUnavailability: newUnavailbility,
            })

        })

        this.props.socket?.emit('refresh-request');
        this.props.socket?.on('refresh-response', (currentWaitingUser: number, currentUnavailableRooms: number[]) => {
            const newUnavailbility = this.state.buttonUnavailability.reduce((prev, curr, index) => {
                prev[index] = currentUnavailableRooms.includes(index+1)
                return prev;
            }, this.state.buttonUnavailability)

            this.setState( { 
                waitingUserNumber : currentWaitingUser,
                buttonUnavailability: newUnavailbility,
            })
        })

        this.props.socket?.on('get-add-song', () => {
            alert('mobile test success!')
        })
    }

    render(){


        return(
            <CONTAINER>
                <Header size={"huge"}> 노인코래방 </Header>
                <Header size={"small"}> 현재 대기방인원 : {this.state.waitingUserNumber} </Header>
                
                <Button color='green' onClick={()=> this.props.socket.emit('leave-room') }>
                        나가기
                </Button>

                <Card.Group>
                <Card fluid>
                <Card.Content>
                    <Card.Header>1번 방</Card.Header>
                    <Card.Meta>노래방</Card.Meta>
                    <Card.Description>
                        {
                            (!this.state.buttonUnavailability[0])? "현재인원: 0 / 1" : "현재인원: 1 / 1"
                        }
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <Button 
                        color='green'
                        disabled={this.state.buttonUnavailability[0]}
                        onClick={()=> { 
                            this.props.socket.emit('join-room', 1)
                            const unavailbility = this.state.buttonUnavailability;
                            unavailbility[0] = true;
                            this.setState({buttonUnavailability: unavailbility}, () => {
                                // this.props.history.push('/room')
                                //history??..
                                //join?
                            })
                        }}>
                            입장하기
                    </Button>
                </Card.Content>
                </Card>
                <Card fluid>
                <Card.Content>
                    <Card.Header>2번 방</Card.Header>
                    <Card.Meta>노래방</Card.Meta>
                    <Card.Description>
                        {
                            (!this.state.buttonUnavailability[1])? "현재인원: 0 / 1" : "현재인원: 1 / 1"
                        }
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <Button 
                        color='green'
                        disabled={this.state.buttonUnavailability[1]}
                        onClick={()=> { 
                            this.props.socket.emit('join-room', 2)
                            const unavailbility = this.state.buttonUnavailability;
                            unavailbility[1] = true;
                            this.setState({buttonUnavailability: unavailbility}, () => {
                                // this.props.history.push('/room')
                            })
                        }}>
                            입장하기
                    </Button>
                </Card.Content>
                </Card>
                <Card fluid>
                <Card.Content>
                    <Card.Header>3번 방</Card.Header>
                    <Card.Meta>노래방</Card.Meta>
                    <Card.Description>
                        {   
                            (!this.state.buttonUnavailability[2])? "현재인원: 0 / 1" : "현재인원: 1 / 1"
                        }
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <Button 
                        color='green'
                        disabled={this.state.buttonUnavailability[2]}
                        onClick={()=> { 
                            this.props.socket.emit('join-room', 3)
                            const unavailbility = this.state.buttonUnavailability;
                            unavailbility[2] = true;
                            this.setState({buttonUnavailability: unavailbility}, () => {
                                this.props.history.push('/room/3')
                            })
                        }}>
                            입장하기
                    </Button>
                    <Button 
                        color='red'
                        onClick={()=>{
                            this.props.socket.emit('add-song', {roomId: 3} )
                        }}
                    >
                            모바일 add button 테스트
                    </Button>

                </Card.Content>
                </Card>
                <Card fluid>
                <Card.Content>
                    <Card.Header>4번 방</Card.Header>
                    <Card.Meta>노래방</Card.Meta>
                    <Card.Description>
                        {
                            (!this.state.buttonUnavailability[3])? "현재인원: 0 / 1" : "현재인원: 1 / 1"
                        }
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <Button 
                        color='green'
                        disabled={this.state.buttonUnavailability[3]}
                        onClick={()=> { 
                            this.props.socket.emit('join-room', 4)
                            const unavailbility = this.state.buttonUnavailability;
                            unavailbility[3] = true;
                            this.setState({buttonUnavailability: unavailbility}, () => {
                                this.props.history.push('/room/4')
                            })
                        }}>
                            입장하기
                    </Button>
                </Card.Content>
                </Card>

          </Card.Group>
          </CONTAINER>
        )

    }
}

export default withRouter(WaitingRoom);