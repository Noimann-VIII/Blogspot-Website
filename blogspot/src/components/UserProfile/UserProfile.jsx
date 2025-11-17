import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
import "./user-profile.css";
import { auth } from "../../firebase-config";
import { signOut } from "firebase/auth";

function UserProfile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Get current user from Firebase
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        const name = currentUser.displayName || currentUser.email || "User";
        const nameParts = name.split(" ");
        setUser({
          firstName: nameParts[0],
          lastName: nameParts[1] || "",
          email: currentUser.email,
        });
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  const logOut = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      alert("Error logging out: " + error.message);
    }
  };

  if (!user) {
    return <div className="profile-card"><p>Loading...</p></div>;
  }

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
            src={`https://avatar.iran.liara.run/username?username=${user.firstName}+${user.lastName}&background=000000&color=FFFFFF`}
            alt="Profile"
          />
          <button>
            <i className="fa fa-upload" />
          </button>
          <input id="inpProfilePicture" style={{ display: "none" }} type="file" />
        </div>
        <h2>{user.firstName} {user.lastName}</h2>
        <h4>{user.email}</h4>
      </div>
    </div>
  );
}

export default UserProfile;
