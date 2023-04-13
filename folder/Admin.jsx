import React from 'react';

export function Admin(props) {

    return (
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
                    {props.users.map((row) => {
                        <tr>
                            <td>row.username</td>
                            <td>row.password</td>
                            <td><button><i class="bi bi-trash"></i></button></td>
                        </tr>
                    })}
                </tbody>
            </table>
        </div>
    );
}
