import React from 'react'
import { useState, useRef, useEffect } from 'react'
import './UserForm.css'

export default function UserForm({
  isRegister
}) {
  const usernameRef = useRef();
  const errRef = useRef();

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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("submit");
  };

  return (
    <div>
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
            <label htmlFor="username">
              Username:
              
              
            </label>
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
                emailFocus && email && !validEmail
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
                // className={
                //   validPassword || !password ? "hide size-6" : "invalid size-6"
                // }
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
          <label htmlFor="password">Password:
          </label>
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
                passwordFocus && !validPassword
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
                // className={
                //   validPassword || !password ? "hide size-6" : "invalid size-6"
                // }
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
            <label htmlFor="match-password">Password Match:
            
            </label>
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
                matchFocus && !validMatch
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
                // className={
                //   validMatch || !matchPassword ? "hide size-6" : "invalid size-6"
                // }
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

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}




