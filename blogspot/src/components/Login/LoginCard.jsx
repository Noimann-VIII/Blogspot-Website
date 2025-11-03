import { useState } from "react";
import "./login-card.css";
import { NavLink } from "react-router";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { auth } from "../../firebase-config";

function LoginCard() {

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  // function handleLogin() 
  // {
  //   signInWithEmailAndPassword(auth, email, password)
  //   .then(()=>{window.location.href="/home";
  //   }).catch((error)=>{
  //     alert(error.message);
  //   })
  // }

  return (
    <>
    <div className="login-card">
        <h1>Login</h1>
        <form>
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
            <button type="submit">Login</button>
        </form>
        <NavLink to="/register">Don't have an account? Register here.</NavLink>
    </div>
    </>
  );
}

export default LoginCard;