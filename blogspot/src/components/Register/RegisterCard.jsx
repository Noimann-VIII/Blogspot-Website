import { useEffect, useState } from "react";
import "./register-card.css";
import { NavLink } from "react-router";

function RegisterCard() {
  return (
    <>
    <div className="register-card">
        <h1>Register</h1>
        <form>
            <input type="text" placeholder="FIrst Name" />
            <input type="text" placeholder="Last Name" />
            <div className="form-group">
            <label htmlFor="birthday">Birthday:</label>
            <input type="date" id="birthday" name="birthday" />
            </div>
            <input type="email" placeholder="Email" />
            <input type="password" placeholder="Password" />
             <input type="password" placeholder="Confirm Password" />

            <button type="submit">Continue</button>
        </form>
        <NavLink to="/login">Already have an account? Login here.</NavLink>
    </div>
    </>
  );
}

export default RegisterCard;