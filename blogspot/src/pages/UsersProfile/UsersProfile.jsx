import {useEffect, useState} from "react";
import "./users-profile.css";
import { useParams } from "react-router";

function UsersProfile() {
    const [users,setUsers] = useState();
    const {id} = useParams();

    useEffect(() => {
        fetch(`https://dummyjson.com/users/${id}`)
        .then(response => response.json())
        .then(data => setUsers(data))
    },[id])

  return (
    <>
        <h1>Profile</h1>
        {users?
        <div className="user-profile">
            <div className="left">
                <div className="image-container">
                    <img className = "main-image" src={users.image} alt={users.firstName} />
                </div>
            </div>
            <div className="right">
                <h1>{users.firstName} {users.lastName}</h1>
                <h3>Birthdate: {users.birthDate}</h3>
                <h3>Age: {users.age}</h3>
                <h3>Gender: {users.gender}</h3>
                <br />
                <h2>Contact Details:</h2>
                <h3>Email: {users.email}</h3>
                <h3>Phone: {users.phone}</h3>
            </div>

        </div>
        :
        <h1>Loading...</h1>
        }

  
        </>
  );
}

export default UsersProfile;