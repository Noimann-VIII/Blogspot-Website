import "./nav-bar.css"
import { NavLink } from "react-router";
import logo from '../../assets/Omni Psience Logo Centered.png'

function Navbar() {
    return(
        <>
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
                <NavLink to="/login">Log In</NavLink>
                <NavLink to="/register">Register</NavLink>
            </div>
        </nav>
        </>
    )
}

export default Navbar;