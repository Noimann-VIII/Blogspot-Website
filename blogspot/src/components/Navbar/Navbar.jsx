import "./nav-bar.css";
import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
import { auth } from "../../firebase-config";
import { signOut } from "firebase/auth";
import logo from '../../assets/Omni Psience Logo Centered.png'

function Navbar() {
        const [user, setUser] = useState(null);
        const navigate = useNavigate();

        useEffect(() => {
                const unsub = auth.onAuthStateChanged((u) => setUser(u));
                return unsub;
        }, []);

        const handleSignOut = async () => {
            try {
                await signOut(auth);
                navigate('/login');
            } catch (err) {
                alert(err.message);
            }
        };

        return (
                <nav>
                        <div className="brand-container">
                                <h4>Omni</h4>
                                <img src={logo} alt="logo image" />
                                <h4>Psience</h4>
                        </div>

                        <div className="links-container">
                                <NavLink to="/home">Home</NavLink>
                                <NavLink to="/profile">About</NavLink>
                        </div>

                        <div className="actions-container">
                            {user ? (
                                <>
                                    <button onClick={handleSignOut} className="signout-button">Sign Out</button>
                                </>
                            ) : (
                                <>
                                    <NavLink to="/login">Log In</NavLink>
                                    <NavLink to="/register">Register</NavLink>
                                </>
                            )}
                        </div>
                </nav>
        );
}

export default Navbar;