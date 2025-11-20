import "./edit-profile.css";
import { useEffect, useState } from "react";
import { auth, database } from "../../firebase-config";
import { updateProfile } from "firebase/auth";
import { ref as databaseRef, set, get } from "firebase/database";
import { useNavigate } from "react-router"; 

function EditProfile() {
    const navigate = useNavigate();
    const currentUser = auth.currentUser;

    // 1. State for Profile Fields
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [BirthDate, setBirthDate] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(true); 

    // 2. Load Existing User Data on Component Mount
    useEffect(() => {
        if (!currentUser) {
            navigate("/login");
            return;
        }

        // --- Load data from Firebase Auth ---
        const fullName = currentUser.displayName || "";
        const nameParts = fullName.split(' ');
        setFirstName(nameParts[0] || "");
        setLastName(nameParts.slice(1).join(' ') || "");
        
        // --- Load BirthDate from Realtime Database ---
        const userDbRef = databaseRef(database, `users/${currentUser.uid}`);
        get(userDbRef).then((snapshot) => {
            if (snapshot.exists()) {
                const userData = snapshot.val();
                setBirthDate(userData.birthDate || ""); 
            }
            setLoading(false);
        }).catch((err) => {
            console.error("Error loading user data:", err);
            setLoading(false);
        });

    }, [currentUser, navigate]);

    // 3. Simplified Handlers
    const verifyFirstName = (e) => setFirstName(e.target.value);
    const verifyLastName = (e) => setLastName(e.target.value);
    const verifyBirthDate = (e) => setBirthDate(e.target.value);


    // 4. Main Update Function
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");

        if (!currentUser) {
            setError("*User is not authenticated");
            return;
        }

        // --- Validation Checks ---
        let tempErrors = [];

        // Name Validation
        if (!firstName.trim() || firstName.trim().length <= 1) tempErrors.push("*First Name is too short");
        if (firstName.match(/[0-9.!@#$%^&*(),?":{}|<>]/)) tempErrors.push("*First Name contains invalid characters");
        if (!lastName.trim() || lastName.trim().length <= 2) tempErrors.push("* Last Name is too short");
        if (lastName.match(/[0-9.!@#$%^&*(),?":{}|<>]/)) tempErrors.push("*Last Name contains invalid characters");

        // Birth Date Validation
        if (BirthDate) {
            const today = new Date();
            const birthDate = new Date(BirthDate);
            if (birthDate > today) tempErrors.push("*Future dates are not allowed for birth date");
            let age = today.getFullYear() - birthDate.getFullYear();
            if (age < 18) tempErrors.push("*Must be at least 18 years old");
        }
        
        if (tempErrors.length > 0) {
            setError(tempErrors.join(" "));
            return;
        }

        // --- Core Update Logic ---
        setLoading(true);
        
        try {
            // 1. Update Display Name (Firebase Auth)
            const newFullName = `${firstName.trim()} ${lastName.trim()}`;
            if (newFullName !== currentUser.displayName) {
                await updateProfile(currentUser, { displayName: newFullName });
            }

            // 2. Update Database (Overwrite /users/{uid} record)
            await set(databaseRef(database, `users/${currentUser.uid}`), {
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                birthDate: BirthDate, 
            });

            setSuccessMessage("*Profile updated successfully");

        } catch (err) {
            console.error("Update error:", err.code, err.message);
            setError(`*Failed to update profile`);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="register-card"><h1>Loading profile data...</h1></div>;
    }

    // 5. Render JSX (Log Out button removed)
    return (
        <div className="register-card edit-profile-card">
            <h1>Edit Profile</h1>
            {error && <div className="error-message">{error}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}
            
            <form onSubmit={handleUpdateProfile}>
                {/* Full Name Fields */}
                <input onInput={verifyFirstName} type="text" placeholder="First Name" value={firstName} />
                <p className="text-error" id="errFName"></p>

                <input onChange={verifyLastName} type="text" placeholder="Last Name" value={lastName} />
                <p className="text-error" id="errLName"></p>
                
                {/* Birth Date Field */}
                <div className="form-group">
                    <label htmlFor="bdate">Birthday:</label>
                    <input onChange={verifyBirthDate} type="date" id="bdate" name="birthday" value={BirthDate} />
                </div> 
                <p className="text-error" id="errbdate"></p>
                
                <button type="submit" disabled={loading}>
                    {loading ? "Updating..." : "Save Changes"}
                </button>
            </form>
        </div>
    );
}

export default EditProfile;