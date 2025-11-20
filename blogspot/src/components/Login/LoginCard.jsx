import { useState } from "react";
import "./login-card.css";
import { NavLink } from "react-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase-config";

function LoginCard() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleLogin(e) 
  {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("*Input fields are empty");
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      window.location.href="/home";
    }).catch(() => {
      setError("*Invalid credentials");
    })
  }

  return (
    <>
    <div className="login-card">
        <h1>Login</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleLogin}>
            <input onChange={(e)=>setEmail(e.target.value)} type="email" placeholder="Email" />
            <input onChange={(e)=>setPassword(e.target.value)} type="password" placeholder="Password" />
            <button type="submit">Login</button>
        </form>
        <NavLink to="/register">Don't have an account? <span className="underline">Register here</span>.</NavLink>
    </div>
    </>
  );
}

export default LoginCard;