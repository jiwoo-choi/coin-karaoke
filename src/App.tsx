import React, { useState } from 'react';
import logo, { ReactComponent } from './logo.svg';
import './App.css';
import Main from './DisplaySide/Main';
import ControlMain from './ControlSide/ControlMain'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import 'semantic-ui-css/semantic.min.css'
import WaitingRoom from './WaitingRoom/WaitingRoom';
import socektio from 'socket.io-client'
import { errorType } from './type';
import { Dimmer, Icon, Header } from 'semantic-ui-react'
// function withSocket() {
//   return ReactComponent.cre
// }

export interface SocketControllable {
  socket: SocketIOClient.Socket
}


function App() {

  // const [errorState, setErrorState ]= useState(false)
  // const [errorMessage, setErrorMessage ]= useState('');
  
  let retry = 0;
  let socket = socektio.connect('http://ec2-3-23-61-166.us-east-2.compute.amazonaws.com:3000');
  // let socket = socektio.connect('http://localhost:3001/');

    socket.on('connect_error', (err: any) => {
      if (retry < 3) {
        retry++;
      } else {
        socket.disconnect();
        alert('서버 연결 실패. 연결을 끊습니다.')
      }
    })

    socket.on('view-error', (error:errorType) => {
      alert(error.errorMessage)
    })


    // socket.on('view-error', (error:errorType) => {
    //   setErrorState(true);
    //   setErrorMessage(error.errorMessage);
    // })

  return (
    <div className="App">
      {/* <Dimmer active={errorState} page>
        <Header as='h2' icon inverted>
          <Icon name='x' />
            에러!
          <Header.Subheader> { errorMessage }</Header.Subheader>
        </Header>
      </Dimmer> */}

      <Router>
          <Switch>
            <Route path="/" exact >
              <WaitingRoom socket={socket}/>
            </Route>
            <Route path="/remote/:id" exact>
              <ControlMain socket={socket}/>
            </Route>
            <Route path="/room/:id" exact>
              <Main socket={socket}/>
              </Route>
          </Switch>
      </Router>
    </div>
  );
}

export default App;
