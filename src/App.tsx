import React from 'react';
import logo, { ReactComponent } from './logo.svg';
import './App.css';
import Main from './DisplaySide/Main';
import ControlMain from './ControlSide/ControlMain'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import 'semantic-ui-css/semantic.min.css'
import WaitingRoom from './WaitingRoom/WaitingRoom';
import socektio from 'socket.io-client'

// function withSocket() {
//   return ReactComponent.cre
// }

export interface SocketControllable {
  socket: SocketIOClient.Socket
}

function App() {

  let retry = 0;
  let socket = socektio.connect('http://localhost:3001');
  socket.on('connect_error', (err: any) => {
    if (retry < 3) {
      retry++;
    } else {
      socket.disconnect();
      alert('서버 연결 실패. 연결을 끊습니다.')
    }
  })

  //if it is disconnect
  //please disconnect.

  //getUser?

  // socket?.on('test', (message:any) => {
  //   console.log(message)
  // })

  return (
    <div className="App">
      <Router>
          <Switch>
            <Route path="/" exact >
              <WaitingRoom socket={socket}/>
            </Route>
            <Route path="/remote/:id" exact>
              <ControlMain socket={socket}/>
            </Route>
            <Route path="/room/:id" exact component={Main}/>
              <Main socket={socket}/>
          </Switch>
      </Router>
    </div>
  );
}

export default App;
