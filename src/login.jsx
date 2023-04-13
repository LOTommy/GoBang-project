import React from "react";
import { Link } from "react-router-dom";

export class CreateAcc extends React.Component {
  render(){
    return(
      <div className="login-page">
        <div className="form">
          <div className="login">
            <div className="login-header">
              <h3>Create Account</h3>
              <p>Please enter your information.</p>
            </div>
          </div>
          <form class="login-form" action="localhost:3000/register" method="POST">
            <input type="text" placeholder="username"/>
            <input type="password" placeholder="password"/>
            <button id="submbtn">Create</button>
            <p className="message">Registered? <Link to="/login"><a href="#">Login</a></Link></p>
          </form>
        </div>
      </div>
    )
  }
}

export class Login extends React.Component {
  login = ()=>{
    let info = { username: this.username.value, password: this.password.value };
    fetch(
      'localhost:3000/login',
      {
        method: 'POST',
        mode: 'cors',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(info),
      }
    )
    .then((res) => {
      if (res.redirectTo){
        sessionStorage.setItem("username", info.username);
        window.location += res.redirectTo;
      }
      else alert('Authentication failed');
    })
  }
  render(){
    return(
      <div className="login-page">
        <div className="form">
          <div className="login">
            <div className="login-header">
              <h3>LOGIN</h3>
            </div>
          </div>
          <form className="login-form">
            <input
              type="text"
              name="username"
              placeholder="Username"
              ref={(inp) => (this.username = inp)}
            />
            <input
                type="password"
                name="password"
                placeholder="Password"
                ref={(inp) => (this.password = inp)}
              />
            <button onClick={() => this.login()}>login</button>
            <p className="message">Not registered? <Link to="/newacc"><a href="#">Create an account</a></Link></p>
          </form>
        </div>
      </div>
    )
  }
}
