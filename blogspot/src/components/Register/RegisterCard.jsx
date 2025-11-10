import { useEffect, useState } from "react";
import "./register-card.css";
import { NavLink } from "react-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase-config";

function RegisterCard() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [BirthDate,setBirthDate] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");//final password when checked
  const [error, setError] = useState("");

  function verifyFirstName(e) {
  
    let fName = e.target.value;
    let errFName = document.querySelector("#errFName");

   errFName.innerHTML = "";
   setFirstName(null);
    if(fName.match(/[0-9]/)) {
      errFName.innerHTML = "*First Name cannot contain numbers";
    }
    else if(fName.match(/[.!@#$%^&*(),?":{}|<>]/)) {
      errFName.innerHTML = "*First Name cannot contain special characters";
    }
    else if(fName.trim().length <= 0) {
      errFName.innerHTML = "*First Name cannot be empty";
    }
    else if(fName.trim().length <=1) {
      errFName.innerHTML = "*First Name must be more than 1 characters";
    }
    else {
      setFirstName(fName);
    }
    
  }
  function verifyLastName(e) {
  
    let lName = e.target.value;
    let errLName = document.querySelector("#errLName");
    
    errLName.innerHTML = "";
       setLastName(null);
    if(lName.match(/[0-9]/)) {
      errLName.innerHTML = "*Last Name cannot contain numbers";
    }
    else if(lName.match(/[.!@#$%^&*(),?":{}|<>]/)) {
      errLName.innerHTML = "*Last Name cannot contain special characters";
    }
    else if(lName.trim().length <= 0) {
      errLName.innerHTML = "*Last Name cannot be empty";
    }
    else if(lName.trim().length <=2) {
      errLName.innerHTML = "*Last Name must be more than 2 characters";
    }
    else {
      setLastName(lName);
    }
  }
   //verify birth date
  function verifyBirthDate(e) {
    let temp = e.target.value;
    let err = document.querySelector("#errbdate");
    let today = new Date();
    let selectedDate = new Date(temp);
    setBirthDate(null);

    err.innerHTML = "";
    if (selectedDate > today) {
      err.innerHTML = "*Future Dates Not Allowed";
      return;
    }
    let age = today.getFullYear() - selectedDate.getFullYear();
    let monthDiff = today.getMonth() - selectedDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < selectedDate.getDate())) {
      age--;
    }
    
    if (age < 18) {
      err.innerHTML = "*Must be at least 18 years old or older to register";
      return;
    }
    setBirthDate(temp);
  }

  function verifyEmail(e) {
    const emailValue = e.target.value;
    const emailErr = document.querySelector("#emailErr");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    emailErr.innerHTML = "";
    setEmail(null);
    if (emailValue.trim().length === 0) {
      emailErr.innerHTML = "*Email cannot be empty";
    } else if (!emailRegex.test(emailValue)) {
      emailErr.innerHTML = "*Invalid email format";
    } else {
      setEmail(emailValue);
    }
  }

    function verifyPassword(e){
      let passwordValue = e.target.value;
      let passwordErr = document.querySelector("#passwordErr");

      passwordErr.innerHTML = "";
      setPassword(null);
      if(passwordValue.trim().length === 0) {
        passwordErr.innerHTML = "*Password cannot be empty";
      }
      else if(passwordValue.trim().length < 6) {
        passwordErr.innerHTML = "*Password must be at least 6 characters long";
      }
      else if(!passwordValue.match(/[!@#$%^&*(),?":{}|<>]/)) {
        passwordErr.innerHTML = "*Password must contain at least one special character";
      }
      else if(!passwordValue.match(/[0-9]/)) {
        passwordErr.innerHTML = "*Password must contain at least one number";
      }
      else if(!passwordValue.match(/[A-Z]/)) {
        passwordErr.innerHTML = "*Password must contain at least one uppercase letter";
      }
      else {
        setPassword(passwordValue);
      }
    }

    function passwordMatch(e){
      let confirmPasswordValue = e.target.value;
      let confirmPasswordErr = document.querySelector("#confirmPasswordErr");
      
      confirmPasswordErr.innerHTML = "";
      setConfirmPassword(null);
      if(confirmPasswordValue !== password) {
        confirmPasswordErr.innerHTML = "*Passwords do not match";
      }
      else {
        setConfirmPassword(confirmPasswordValue);
      }
    }

    //main function n chinecheck lahat kung filled na ba
   const handleregister = async (e) => {
    e.preventDefault();
    setError("");

    // Validate first name
    if (!firstName || firstName.match(/[0-9]/) || firstName.match(/[.!@#$%^&*(),?":{}|<>]/) || firstName.trim().length <= 1) {
      setError("Please check your first name input");
      return;
    }
    // Validate last name
    if (!lastName || lastName.match(/[0-9]/) || lastName.match(/[.!@#$%^&*(),?":{}|<>]/) || lastName.trim().length <= 2) {
      setError("Please check your last name input");
      return;
    }
    // Validate birthdate and age
    if (!BirthDate) {
      setError("Please enter your birth date");
      return;
    }
    const today = new Date();
    const birthDate = new Date(BirthDate);
    if (birthDate > today) {
      setError("Future dates are not allowed");
      return;
    }
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age < 18) {
      setError("You must be at least 18 years old to register");
      return;
    }
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    // Validate password requirements
    if (!password || 
        password.trim().length < 6 || 
        !password.match(/[!@#$%^&*(),?":{}|<>]/) || 
        !password.match(/[0-9]/) || 
        !password.match(/[A-Z]/)) {
      setError("Please ensure your password meets all requirements");
      return;
    }
    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      let fullname = firstName + " " + lastName;
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      alert("Welcome "+ fullname +"!");
    
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
              <input onInput={(e)=>verifyFirstName(e) } type="text" placeholder="First Name"/>
              <p className="text-error" id="errFName"></p>

              <input onChange={(e)=>verifyLastName(e)} type="text" placeholder="Last Name" />
              <p className="text-error" id="errLName"></p>
             
              <div className="form-group">
              <label htmlFor="birthday">Birthday:</label>
              <input onChange={(e)=>verifyBirthDate(e)} type="date" id="bdate" name="birthday" />
              </div> <p className="text-error" id="errbdate"></p>
           
              <input onInput={(e) => verifyEmail(e)} type="email" placeholder="Email" />
              <p className="text-error" id="emailErr"></p>

              <input onChange={(e) => verifyPassword(e)} type="password" placeholder="Password"/>
              <p className="text-error" id="passwordErr"></p>

              <input onChange={(e) => passwordMatch(e)} type="password" placeholder="Confirm Password"/>
              <p className="text-error" id="confirmPasswordErr"></p>

              {firstName && lastName && BirthDate && email && password && confirmPassword && handleregister ?
                <button type="submit" >Register</button> 
               :
                 <button type="submit" disabled>Register</button>}
        </form>
        <NavLink to="/login">Already have an account? Login here.</NavLink>
    </div>

    
    </>
  );
}

export default RegisterCard;