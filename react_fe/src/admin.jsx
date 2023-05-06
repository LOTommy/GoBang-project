import React from "react";

class Admin extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      loading: true,
      //users: [{id:123, username: 'test', password: 'tpwd'}]
    };
  }
  deluser = (name)=>{
    fetch(
      'localhost:3000/admin/delete-user/'+name,
      {
        method: 'DELETE'
      }
    );
    this.setState({   // reload table
      loading:true
    })
  }
  getuser = ()=>{
    fetch('localhost:3000/admin/users')
    .then(res=>res.json())
    .then(res=>{
      this.setState({
        users: res,
        loading: false
      })
    })
  }
  
  render(){
    if(this.state.loading){
      this.getuser();
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
                  <td><button onClick={()=>this.deluser(row.username)}><i class="bi bi-trash"></i></button></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }
}

export default Admin;