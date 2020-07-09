//waitingroom.
//routing으로 접속하면 어떻게?

import React from "react";
import { Card, Button , Header } from "semantic-ui-react";
import styled from "styled-components";
import { SocketControllable } from "../App";
import { withRouter , RouteComponentProps } from "react-router-dom";
import { errorType, totalState, roomType, roomStateType } from "../type";

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
    roomInfo:roomStateType ;
}

class WaitingRoom extends React.Component<SocketControllable & RouteComponentProps, State> {
    
    constructor(props: SocketControllable & RouteComponentProps) {
        super(props);
        
        this.state = {
            waitingUserNumber: 0,
            roomInfo: {} as roomStateType,
        }
    }


    getCard(roomState:roomStateType) {
        
       return Object.keys(roomState).map( (value, index) => {

            let unavailbility : boolean = !(Object.keys(roomState[value].socektIds).length < roomState[value].limits)
            let roomId = value;
            
            return(
                <Card fluid key={"room"+index}>
                <Card.Content>
                    <Card.Header>{index + 1} 번방</Card.Header>
                    <Card.Meta>노래방</Card.Meta>
                    <Card.Description>
                        현재인원 : {Object.keys(roomState[value].socektIds).length} / {roomState[value].limits}
                    </Card.Description>
                </Card.Content>
                <Card.Content extra>
                    <Button 
                        color='green'
                        disabled={unavailbility}
                        onClick={()=> { 
                            this.props.history.push('/room/' + roomId);
                        }}>
                            입장하기
                    </Button>
                </Card.Content>
                </Card>
            )
        })
    }

    componentDidMount(){
        
        this.props.socket?.emit('join-wait-room');

        this.props.socket?.on('view-update', (state: totalState) => {
            let waitingUserNumber = Object.keys(state.waitRoomState).length;   
            let roomInfo = state.roomState
            this.setState({ waitingUserNumber, roomInfo })
        })

        this.props.socket?.on('view-error', (error:errorType) => {
            alert(error.errorMessage)
        })
    }

    render() {

        return(
            <CONTAINER>
                <Header size={"huge"}> 노인코래방 </Header>
                <Header size={"small"}> 현재 대기방인원 : {this.state.waitingUserNumber} </Header>
                <Card.Group>
                    {this.getCard(this.state.roomInfo)}
                </Card.Group>
          </CONTAINER>
        )

    }
}

export default withRouter(WaitingRoom);