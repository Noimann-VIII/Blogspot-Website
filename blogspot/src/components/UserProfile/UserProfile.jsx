import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
import "./user-profile.css";
import { auth, database } from "../../firebase-config";
// Removed: import { signOut } from "firebase/auth";
import { ref, onValue } from "firebase/database";

function UserProfile() {
// Initial state should include the fields we expect to display
const [user, setUser] = useState(null);
 const navigate = useNavigate();
    // Removed: const logOut = async () => { ... }

 // 1. Get current user's UID from Firebase Auth
 useEffect(() => {
  const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
   if (currentUser) {
    // --- FAST FALLBACK LOGIC ---
    const name = currentUser.displayName || currentUser.email || "User";
    const nameParts = name.split(" ");
    const fallbackFirstName = nameParts[0];
    const fallbackLastName = nameParts[1] || "";
    // ---------------------------
        
    setUser({ 
     uid: currentUser.uid, 
     email: currentUser.email,
     firstName: fallbackFirstName,
     lastName: fallbackLastName 
    });
   } else {
    setUser(null);
   }
  });

  return unsubscribeAuth;
 }, []);

 // 2. Fetch DEFINITIVE Names from Realtime Database (Runs once UID is available)
 useEffect(() => {
  // Only proceed if user object and UID exist
  if (user && user.uid) {
   const userRef = ref(database, `users/${user.uid}`);

   const unsubscribeDB = onValue(userRef, (snapshot) => {
    if (snapshot.exists()) {
     const dbUserData = snapshot.val();
     
     // Accessing the nested 'fullName' object
     const { fullName } = dbUserData;
     
     if (fullName) {
      // Get firstName and lastName from the nested fullName object
      const firstName = fullName.firstName || user.firstName;
      const lastName = fullName.lastName || user.lastName;

      // Update state with the definitive names from the database
      setUser((prevUser) => ({
       ...prevUser,
       firstName,
       lastName,
      }));
     }
    }
   });

   return () => unsubscribeDB(); // Clean up the DB listener
  }
 }, [user?.uid]);

 // --- RENDERING LOGIC ---
 if (!user) {
  // If no user is logged in (auth state is null)
  return <div className="user-card"><p>Please Log In</p></div>;
 }
 
 // Display the name that is currently in state
 const displayName = (user.firstName && user.lastName) 
  ? `${user.firstName} ${user.lastName}` 
  : "Loading Name..."; 

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
    {/* Removed: <button onClick={logOut} className="logout-button">Logout</button> */}
   </div>
  </div>
 );
}

export default UserProfile;