import React, { useState } from 'react';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import {Login, CreateAcc} from './login';
import User from './user';
import Admin from './admin';

class App extends React.Component {
  render() {
    return (
      <>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/newacc" element={<CreateAcc />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/user" element={<User />} />
            <Route path="/user/sologame" element={<User mode='sologame' />} />
            <Route path="/user/game" element={<User mode='game' />} />
            <Route path="/user/record" element={<User mode='record' />} />
            <Route path="/*" element={<NoMatch />} />
          </Routes>
        </BrowserRouter>
      </>
    )
  }
}

function NoMatch() {
  return (
    <div style={{ position: "absolute", top: "20%", left: "20%", right: "15%", bottom: "10%", alignItems: "center" }}>
      <img className="img-fluid" src="/404.png"></img>
    </div>
  );
}

export default App;