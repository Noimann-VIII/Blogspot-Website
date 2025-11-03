import { useEffect, useState } from "react";
import "./profile.css";
import { NavLink } from "react-router";
import ProfileCard from "../../components/ProfileCard/ProfileCard";


function Profile() {
  return (
    <>

      <h1>Profile!</h1>
    

    <div> 
      <ProfileCard/>
      </div>  
 
    </>
  );
}

export default Profile;