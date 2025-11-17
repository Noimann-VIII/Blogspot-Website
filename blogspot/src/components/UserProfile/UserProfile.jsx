import { NavLink } from "react-router";
import "./user-profile.css";

function UserProfile() {

  // Temporary logOut placeholder
  const logOut = () => {
    alert("Logged out!"); // replace with actual auth logout later
  };

  return (
    <div className="profile-card">
      <div className="profile-buttons">
        <NavLink to="/edit-profile">
          <button style={{ textDecoration: "none" }}>
            <i className="fa fa-edit" />
          </button>
        </NavLink>
        <button onClick={logOut}>
          <i className="fa fa-sign-out" />
        </button>
      </div>
      <div className="profile-details">
        <div className="profile-picture">
          <img
            src={`https://avatar.iran.liara.run/username?username=Kyla+Naz&background=000000&color=FFFFFF`}
            alt="Profile"
          />
          <button>
            <i className="fa fa-upload" />
          </button>
          <input id="inpProfilePicture" style={{ display: "none" }} type="file" />
        </div>
        <h2>Kyla Naz</h2>
        <h4>kyla@gmail.com</h4>
        <p>09059587128</p>
      </div>
    </div>
  );
}

export default UserProfile;
