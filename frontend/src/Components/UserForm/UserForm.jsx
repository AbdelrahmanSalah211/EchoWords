import React from "react";
import { useState, useRef, useEffect } from "react";
import "./UserForm.css";
import { NavLink, useNavigate } from "react-router";

export default function UserForm({ isRegister }) {
  const usernameRef = useRef();
  const errRef = useRef();

  const navigate = useNavigate();

  const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
  const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
  const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const [username, setUsername] = useState("");
  const [validUsername, setValidUsername] = useState(false);
  const [usernameFocus, setUsernameFocus] = useState(false);

  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [matchPassword, setMatchPassword] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  useEffect(() => {
    if (isRegister) {
      usernameRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const checkedUsername = USER_REGEX.test(username);
    console.log(username);
    console.log(checkedUsername);
    setValidUsername(checkedUsername);
  }, [username]);

  useEffect(() => {
    const checkedEmail = EMAIL_REGEX.test(email);
    console.log(email);
    console.log(checkedEmail);
    setValidEmail(checkedEmail);
  }, [email]);

  useEffect(() => {
    const checkedPassword = PWD_REGEX.test(password);
    console.log(password);
    console.log(checkedPassword);
    setValidPassword(checkedPassword);
    const match = password === matchPassword;
    console.log(match);
    setValidMatch(match);
  }, [password, matchPassword]);

  useEffect(() => {
    setErrMsg("");
  }, [username, password, matchPassword, email]);

  const onUsernameChange = (e) => {
    const newUsername = e.target.value;
    setUsername(newUsername);
  };

  const onPasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
  };

  const onMatchPasswordChange = (e) => {
    const newMatchPassword = e.target.value;
    setMatchPassword(newMatchPassword);
  };

  const onEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("submit");
    

    

    switch (isRegister) {
      case true:
        {
        const isValidUsername = USER_REGEX.test(username);
        const isValidEmail = EMAIL_REGEX.test(email);
        const isValidPassword = PWD_REGEX.test(password);
        if (!isValidUsername || !isValidEmail || !isValidPassword) {
          setErrMsg("Invalid Entry");
          return;
        }
        console.log("Valid Entry");
        const userData = {
          username: username,
          email: email,
          password: password
        };
        
        const response = await fetch('http://localhost:3000/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        })
        const data = await response.json();
        console.log(data);
        if (response.ok) {
          setSuccess(true);
          console.log("User registered successfully");
          navigate("/signin");
        }
        else {
          setErrMsg(data.message);
          console.log("User registration failed");
        }
        setUsername("");
        setPassword("");
        setEmail("");
        setMatchPassword("");
        setValidUsername(false);
        setValidPassword(false);
        setValidEmail(false);
        setValidMatch(false);
        break;
      }

      case false:
        {
          const isValidEmail = EMAIL_REGEX.test(email);
          const isValidPassword = PWD_REGEX.test(password);
          if (!isValidEmail || !isValidPassword) {
            setErrMsg("Invalid Entry");
            return;
          }
        console.log("Valid Entry");
        const userData = {
          email: email,
          password: password
        };
        
        const response = await fetch('http://localhost:3000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        })
        const data = await response.json();
        console.log(data);
        if (response.ok) {
          setSuccess(true);
          console.log("User logged in successfully");
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify({
            email: data.email,
            username: data.username,
            id: data.id
          }));
          navigate("/home");
        }
        else {
          setErrMsg(data.message);
          console.log("User login failed");
        }
        setPassword("");
        setEmail("");
        setValidPassword(false);
        setValidEmail(false);
        break;
      }
    
      default:
        console.log("default case");
        break;
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-5">
      <p
        ref={errRef}
        className={errMsg ? "errmsg" : "offscreen"}
        aria-live="assertive"
      >
        {errMsg}
      </p>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center items-center"
      >
        {/* username */}
        {isRegister && (
          <div className="flex flex-col">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              ref={usernameRef}
              value={username}
              autoComplete="off"
              onChange={onUsernameChange}
              aria-invalid={validUsername ? "false" : "true"}
              aria-describedby="uidnote"
              onFocus={() => setUsernameFocus(true)}
              onBlur={() => setUsernameFocus(false)}
              required
            ></input>

            <p
              id="uidnote"
              className={
                usernameFocus && username && !validUsername
                  ? "instructions"
                  : "offscreen"
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                />
              </svg>
              4 to 24 characters.
              <br />
              Must inlude upper and lower letters.
            </p>
          </div>
        )}

        {/* email */}
        <div className="flex flex-col">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            autoComplete="off"
            onChange={onEmailChange}
            aria-invalid={validEmail ? "false" : "true"}
            aria-describedby="emailnote"
            onFocus={() => setEmailFocus(true)}
            onBlur={() => setEmailFocus(false)}
            required
          ></input>

          <p
            id="emailnote"
            className={
              emailFocus && email && !validEmail ? "instructions" : "offscreen"
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"

              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
              />
            </svg>
            Must be a valid email address.
          </p>
        </div>

        {/* password */}
        <div className="flex flex-col">
          <label htmlFor="password">Password:</label>
          <input
            type="text"
            id="password"
            value={password}
            aria-invalid={validPassword ? "false" : "true"}
            aria-describedby="pwdnote"
            onChange={onPasswordChange}
            onFocus={() => setPasswordFocus(true)}
            onBlur={() => setPasswordFocus(false)}
            required
          ></input>

          <p
            id="pwdnote"
            className={
              passwordFocus && !validPassword ? "instructions" : "offscreen"
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"

              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
              />
            </svg>
            Must inlude upper and lower letters.
            <br />
            specail characters allowed: !@#$%
          </p>
        </div>

        {/* match password */}
        {isRegister && (
          <div className="flex flex-col">
            <label htmlFor="match-password">Password Match:</label>
            <input
              type="text"
              id="match-password"
              value={matchPassword}
              aria-invalid={validMatch ? "false" : "true"}
              aria-describedby="matchnote"
              onChange={onMatchPasswordChange}
              onFocus={() => setMatchFocus(true)}
              onBlur={() => setMatchFocus(false)}
              required
            ></input>

            <p
              id="matchnote"
              className={
                !validMatch ? "instructions" : "offscreen"
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                />
              </svg>
              Must match password.
            </p>
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary cursor-pointer"
          disabled={
            isRegister
              ? !validUsername || !validEmail || !validPassword || !validMatch
              : !validEmail || !validPassword
          }
        >{isRegister ? "Sign Up" : "Sign In"}</button>
      </form>
      <p>
        Already registered ?
        <br />
        <span className="line">
          <NavLink to="/signin">Sign In</NavLink>
        </span>
      </p>
    </div>
  );
}
