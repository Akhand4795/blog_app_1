import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./register.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [usernameError, setUsernameError] = useState(null);
  const [emailError, setEmailError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Input validation: Check if any of the fields are empty
    if (!username || !email || !password) {
      setErrorMessage("Please fill in all fields.");
      setTimeout(() => setErrorMessage(null), 4000);
      return;
    }

    // Username validation: Check if the username meets the specified criteria
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_]{5,29}$/;
    if (!username.match(usernameRegex)) {
      setErrorMessage(
        "Username must be 6 to 30 characters long, start with an alphabetic character, and contain only alphanumeric characters and underscores."
      );
      setTimeout(() => setErrorMessage(null), 4000);
      return;
    }

    // Email validation: Check if the email follows a valid format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.match(emailRegex)) {
      setErrorMessage("Please enter a valid email address.");
      setTimeout(() => setErrorMessage(null), 4000);
      return;
    }

    // Password validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!password.match(passwordRegex)) {
      setErrorMessage(
        "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, one special symbol (@, $, !, %, *, ?, &) ."
      );
      setTimeout(() => setErrorMessage(null), 4000);
      return;
    }

    try {
      const res = await axios.post("/auth/register", {
        username: username,
        email: email,
        password: password,
      });
      // console.log(res);
      res.data && window.location.replace("/login")
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const errorMessage = error.response.data.message;
        if (errorMessage.includes("Username")) {
          setUsernameError(errorMessage);
          setEmailError(null);
          setTimeout(() => setUsernameError(null), 2000);
        } else if (errorMessage.includes("Email")) {
          setEmailError(errorMessage);
          setUsernameError(null);
          setTimeout(() => setEmailError(null), 2000);
        }
      } else {
        // Handle other types of errors
        setUsernameError(null);
        setEmailError(null);
        setErrorMessage(
          "An error occurred. Please check your input and try again."
        );
      }
    }
  };

  return (
    <div className="register">
      <span className="registerTitle">Register</span>
      <form className="registerForm" onSubmit={handleSubmit}>
        <label>Username</label>
        <input
          type="text"
          className="registerInput"
          placeholder="Enter your username..."
          onChange={(e) => setUsername(e.target.value)}
        />
        {usernameError && <p className="error">{usernameError}</p>}
        <label>Email</label>
        <input
          type="text"
          className="registerInput"
          placeholder="Enter your email..."
          onChange={(e) => setEmail(e.target.value)}
        />
        {emailError && <p className="error">{emailError}</p>}
        <label>Password</label>
        <input
          type="password"
          className="registerInput"
          placeholder="Enter your password..."
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="registerButton" type="submit">
          Register
        </button>
      </form>
      <button className="registerLoginButton">
        <Link className="link" to="/login">
          Login
        </Link>
      </button>
      {errorMessage && <p className="error">{errorMessage}</p>}
    </div>
  );
};

export default Register;
