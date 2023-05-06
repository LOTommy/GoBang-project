import React from "react";
import { Link } from "react-router-dom";

class Actions extends React.Component {
  render(){
    return(
      <div className="login-page">
        <div className="form">
          <div className="login-form">
            <h3>Welcome {window.sessionStorage.getItem('username')}</h3>
            <button id="newgamebtn" onclick={()=>fetch(' game url')}>New Game</button>
            <Link to="/user/sologame"><button id="cpugamebtn">New Game with CPU</button></Link>
            <Link to="/user/record"><button id="gamerecbtn">Game Records</button></Link>            
            <button id="logoutbtn" onClick={()=>{fetch('localhost:3000/logout')}}>Logout</button>
          </div>
        </div>
      </div>
    )
  }
}

class Sologame extends React.Component{
  render(){
    window.location = 'http://localhost:3000/main';
    return;
  }
}

class Board extends React.Component {
  render(){
    return(
      <img crossOrigin="anonymous" src={this.props.id+'.jpg'} style={{width: '70%'}}/>
    )
  }
}

class Record extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      loading: true,    // set false for debug
      //games: [{gameID: 'awd321', start_time:123, elapsed_time: 999, winner: 'player1'}]
    };
  }

  getrecord = ()=>{
    fetch('localhost:3000/admin/game-records/'+ window.sessionStorage.getItem('username'))
    .then(res=>res.json())
    .then(res=>{
      this.setState({
        games: res,
        loading: false
      })
    })
  }
  getboardimg = (id)=>{
    
  }
  render(){
    if(this.state.loading){
      return <img src="/loading.gif" style={{width: '10%', marginLeft: '50%', marginTop: '20%'}}/>
    }
    return(
      <div className="p-5">
        <h1 style={{color: 'aliceblue'}}> Game Records</h1>
        <table className="table table-dark">
          <thead>
            <tr>
              <th scope="col">Time Started</th>
              <th scope="col">Time Elapsed</th>
              <th scope="col">Winner</th>
              <th scope="col">Final Board</th>
            </tr>
          </thead>
          <tbody>
            {this.state.games.map((row) => {
              return(
                <tr>
                  <td>{row.start_time}</td>
                  <td>{row.elapsed_time}</td>
                  <td>{row.winner}</td>
                  <td><button onClick={()=>this.getboardimg(row.gameID)}><i class="bi bi-eye"></i></button></td>
                </tr>
              )
            })}
          </tbody>
        </table>
    </div>
    )
  }
}



class User extends React.Component {  
  render(){
    if(this.props.mode === 'sologame') return <Sologame />
    else if (this.props.mode === 'game') return <Actions />
    else if (this.props.mode === 'record') return <Record />
    else return <Actions />      // default view
  }
}

export default User;
