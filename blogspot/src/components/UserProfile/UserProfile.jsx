import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
import "./user-profile.css";
import { auth, database } from "../../firebase-config";
import { ref, onValue } from "firebase/database";

function UserProfile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        const name = currentUser.displayName || currentUser.email || "User";
        const nameParts = name.split(" ");
        const fallbackFirstName = nameParts[0];
        const fallbackLastName = nameParts[1] || "";

        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          firstName: fallbackFirstName,
          lastName: fallbackLastName,
        });
      } else {
        setUser(null);
      }
    });

    return unsubscribeAuth;
  }, []);

  useEffect(() => {
    if (user && user.uid) {
      const userRef = ref(database, `users/${user.uid}`);

      const unsubscribeDB = onValue(userRef, (snapshot) => {
        if (snapshot.exists()) {
          const dbUserData = snapshot.val();

          const { fullName } = dbUserData;

          if (fullName) {
            const firstName = fullName.firstName || user.firstName;
            const lastName = fullName.lastName || user.lastName;

            setUser((prevUser) => ({
              ...prevUser,
              firstName,
              lastName,
            }));
          }
        }
      });

      return () => unsubscribeDB();
    }
  }, [user?.uid]);

  if (!user) {
    return (
      <div className="user-card">
        <p>Please Log In</p>
      </div>
    );
  }

  const displayName = user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : "Loading Name...";

  const isProfileDataLoaded = user.firstName && user.lastName;
  const avatarName = isProfileDataLoaded ? `${user.firstName}+${user.lastName}` : "User+Profile";

  return (
    <div className="user-card">
      <div className="user-buttons">
        <NavLink to="/edit-profile">
          <button style={{ textDecoration: "none" }}>
            <i className="fa fa-edit" />
          </button>
        </NavLink>
      </div>
      <div className="user-details">
        <div className="user-picture">
          <img
            src={`https://avatar.iran.liara.run/username?username=${avatarName}&background=000000&color=FFFFFF`}
            alt="user"
          />
        </div>
        <h2>{displayName}</h2>
        <h4>{user.email}</h4>
      </div>
    </div>
  );
}

export default UserProfile;