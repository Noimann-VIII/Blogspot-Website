import { useEffect, useState } from "react";
import "./register-card.css";
import { NavLink } from "react-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase-config";

function RegisterCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleregister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      window.location.href="/home";
    
    } catch (error) {
      setError(error.message);
      console.error("Registration error:", error);
    }
  }

  return (
    <>
    <div className="register-card">
        <h1>Register</h1>
        {error && <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        <form onSubmit={handleregister}>
            <input type="text" placeholder="First Name" />
            <input type="text" placeholder="Last Name" />
            <div className="form-group">
              <label htmlFor="birthday">Birthday:</label>
              <input type="date" id="birthday" name="birthday" />
            </div>
            <input 
              onChange={(e) => setEmail(e.target.value)}
              type="email" 
              placeholder="Email" 
              required
              value={email}
            />
            <input 
              onChange={(e) => setPassword(e.target.value)}
              type="password" 
              placeholder="Password" 
              required
              minLength="6"
              value={password}
            />
            <input 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              type="password" 
              placeholder="Confirm Password" 
              required 
              minLength="6"
            />
            <button type="submit">Register</button>
        </form>
        <NavLink to="/login">Already have an account? Login here.</NavLink>
    </div>
    </>
  );
}

export default RegisterCard;