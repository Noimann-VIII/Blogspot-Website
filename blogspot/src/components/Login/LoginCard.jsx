import { useEffect, useState } from "react";
import "./login-card.css";
import { NavLink } from "react-router";

function LoginCard() {
  return (
    <>
    <div className="login-card">
        <h1>Login</h1>
        <form>
            <input type="text" placeholder="Username" />
            <input type="password" placeholder="Password" />
            <button type="submit">Login</button>
        </form>
        <NavLink to="/register">Don't have an account? Register here.</NavLink>
    </div>
    </>
  );
}

export default LoginCard;