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
            <button id="cpugamebtn"  onClick={()=>fetch('solo game url')}>New Game with CPU</button>
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
    return(
      <div style={{margin: '1rem', height:'80%'}}>
        <iframe src="sologame server url" style={{width:'100%', height:'100%'}}></iframe>
      </div>
    )
  }
}

class Record extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      loading: true,
      //games: [{id:123, username: 'test', password: 'tpwd'}]
    };
  }

  getrecord = ()=>{
    fetch('path to fetch game record')
    .then(res=>res.json())
    .then(res=>{
      this.setState({
        games: res,
        loading: false
      })
    })
  }
  
  render(){
    if(this.state.loading){
      return <img src="/loading.gif" style={{width: '10%', marginLeft: '50%', marginTop: '20%'}}/>
    }
    return(
      <div className="p-5">
        <h1 style={{ color: "aliceblue" }}> User List</h1>
        <table className="table table-dark">
          <thead>
            <tr>
              <th scope="col">username</th>
              <th scope="col">password</th>
              <th scope="col">delete user</th>
            </tr>
          </thead>
          <tbody>
            {this.state.users.map((row) => {
              return(
                <tr>
                  <td>{row.username}</td>
                  <td>{row.password}</td>
                  <td><button onClick={()=>this.deluser(row.id)}><i class="bi bi-trash"></i></button></td>
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