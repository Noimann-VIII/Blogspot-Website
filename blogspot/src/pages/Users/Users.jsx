import { useEffect, useState } from "react";
import "./users.css";
import { NavLink } from "react-router";

function Users() {
    const [users,setUsers] = useState([]);

    useEffect(() => {
        fetch("https://dummyjson.com/users")
        .then(response => response.json())
        .then(data => setUsers(data.users))
    },[])

  return (
    <>
        <h1>Users</h1>
        <div className="users-container">
            {users.map((user)=>{
                return(
                <NavLink to={`/users/${user.id}`} className="user-card" key={user.id}>
                    <div>
                    <img src={user.image} alt="profile-picture"/>
                    </div>
                    <div>
                        <h1>{user.firstName} {user.lastName}</h1>
                    </div>
                </NavLink>
                )
            })}
        </div>
    </>
  );
}

export default Users;