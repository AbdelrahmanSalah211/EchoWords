import React, { useContext } from "react";
import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router";
import AuthContext from "../../Context/AuthProvider";
import Joi from "joi";
import { toast } from "react-toastify";

export default function UserForm({ isRegister }) {
  const schema = Joi.object({
    username: Joi.string().min(4).required().label('Username'),
  
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .label('Email'),
  
    password: Joi.string()
      .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z0-9]).{8,}$'))
      .required()
      .label('Password')
      .messages({
        'string.pattern.base': 'Password must contain at least 1 uppercase, 1 lowercase, 1 number, 1 special character and be at least 8 characters long.',
      }),
  });

  const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

  const usernameRef = useRef();
  const errRef = useRef();

  const navigate = useNavigate();

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

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const { auth, setAuth } = useContext(AuthContext);

  useEffect(() => {
    if (isRegister) {
      usernameRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (errMsg) {
      errRef.current.focus();
    }
  }, [errMsg]);

  useEffect(() => {
    const { value, error } = schema.extract('username').validate(username);
    setValidUsername(!error);
  }, [username]);

  useEffect(() => {
    const { value, error } = schema.extract("email").validate(email);
    setValidEmail(!error);
  }, [email]);

  useEffect(() => {
    const { value, error } = schema.extract("password").validate(password);
    setValidPassword(!error);
    const match = password === matchPassword;
    setValidMatch(match);
  }, [password, matchPassword]);

  useEffect(() => {
    setErrMsg("");
  }, [username, password, matchPassword, email]);

  const onUsernameChange = (e) => {
    const newUsername = e.target.value;
    setUsername(newUsername);
  };

  const onNavigating = () => {
    setUsername("");
    setPassword("");
    setEmail("");
    setMatchPassword("");
    setValidUsername(false);
    setValidPassword(false);
    setValidEmail(false);
    setValidMatch(false);
    setErrMsg("");
  }

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
    switch (isRegister) {
      case true:
        {
        const userData = {
          username: username.toLowerCase(),
          email: email.toLowerCase(),
          password: password
        };
        try {
          const response = await fetch(`${API_ENDPOINT}/users/signup`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
          })
          const data = await response.json();
          if(response.status !== 201) {
            throw new Error(data.message);
          }
          toast.success("User registered successfully");
          navigate("/home/signin");
          setUsername("");
          setPassword("");
          setEmail("");
          setMatchPassword("");
          setValidUsername(false);
          setValidPassword(false);
          setValidEmail(false);
          setValidMatch(false);
        } catch (error) {
          setErrMsg(error.message);
          console.log("User registration failed", error);
        }
        break;
      }

      case false:
        {
        const userData = {
          email: email.toLowerCase(),
          password: password
        };
        try {
          const response = await fetch(`${API_ENDPOINT}/users/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(userData)
          })
          const data = await response.json();
          if (response.status !== 200) {
            throw new Error(data.message);
          }
          setAuth({ token: data.accessToken, user: {
            id: data.user.id,
            username: data.user.username,
            email: data.user.email,
            photo: data.user.photo,
          }});
          toast.success("User loged in successfully");
          navigate("/");
          setPassword("");
          setEmail("");
          setValidPassword(false);
          setValidEmail(false);
        } catch (error) {
          setErrMsg(error.message);
          console.log("User login failed", error);
        }
        break;
      }

      default:
        console.log("default case");
        break;
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-6 p-4 shadow-xl">
      <h2 className="text-2xl font-bold">{isRegister ? "Sign Up" : "Sign In"}</h2>
  
      {errMsg && (
        <p
          ref={errRef}
          className="alert alert-error text-sm text-red-700 font-semibold"
          aria-live="assertive"
        >
          {errMsg}
        </p>
      )}
  
      <form
        onSubmit={handleSubmit}
        className="flex flex-col justify-center items-center gap-4 w-64"
      >
        {/* username */}
        {isRegister && (
          <div className="form-control w-full">
            <label htmlFor="username" className="label">
              <span className="label-text">Username:</span>
            </label>
            <input
              type="text"
              id="username"
              ref={usernameRef}
              value={username}
              autoComplete="off"
              onChange={onUsernameChange}
              aria-invalid={!validUsername}
              aria-describedby="uidnote"
              onFocus={() => setUsernameFocus(true)}
              onBlur={() => setUsernameFocus(false)}
              required
              className="input input-sm input-bordered w-full"
            />
            <p
              id="uidnote"
              className={`mt-1 text-xs p-2 rounded bg-black text-white ${
                usernameFocus && username && !validUsername ? "" : "hidden"
              }`}
            >
              must be at least 4 characters long.
            </p>
          </div>
        )}
  
        {/* email */}
        <div className="form-control w-full">
          <label htmlFor="email" className="label">
            <span className="label-text">Email:</span>
          </label>
          <input
            type="email"
            id="email"
            value={email}
            autoComplete="off"
            onChange={onEmailChange}
            aria-invalid={!validEmail}
            aria-describedby="emailnote"
            onFocus={() => setEmailFocus(true)}
            onBlur={() => setEmailFocus(false)}
            required
            className="input input-sm input-bordered w-full"
          />
          {isRegister && (
            <p
              id="emailnote"
              className={`mt-1 text-xs p-2 rounded bg-black text-white ${
                emailFocus && email && !validEmail ? "" : "hidden"
              }`}
            >
              Must be a valid email address.
            </p>
          )}
        </div>
  
        {/* password */}
        <div className="form-control w-full">
          <label htmlFor="password" className="label">
            <span className="label-text">Password:</span>
          </label>
          <input
            type="password"
            id="password"
            value={password}
            aria-invalid={!validPassword}
            aria-describedby="pwdnote"
            onChange={onPasswordChange}
            onFocus={() => setPasswordFocus(true)}
            onBlur={() => setPasswordFocus(false)}
            required
            className="input input-sm input-bordered w-full"
          />
          {isRegister && (
            <p
              id="pwdnote"
              className={`mt-1 text-xs p-2 rounded bg-black text-white ${
                passwordFocus && !validPassword ? "" : "hidden"
              }`}
            >
              Must contain 1 uppercase, 1 lowercase<br/>1 special character and be at least 8 characters long.
            </p>
          )}
        {!isRegister && <NavLink
          to="/forgetpassword"
          className="text-blue-600 underline"
        >
          Forgert Password
        </NavLink>}
        </div>

  
        {/* match password */}
        {isRegister && (
          <div className="form-control w-full">
            <label htmlFor="match-password" className="label">
              <span className="label-text">Confirm Password:</span>
            </label>
            <input
              type="password"
              id="match-password"
              value={matchPassword}
              aria-invalid={!validMatch}
              aria-describedby="matchnote"
              onChange={onMatchPasswordChange}
              onFocus={() => setMatchFocus(true)}
              onBlur={() => setMatchFocus(false)}
              required
              className="input input-sm input-bordered w-full"
            />
            <p
              id="matchnote"
              className={`mt-1 text-xs p-2 rounded bg-black text-white ${
                matchFocus && matchPassword && !validMatch ? "" : "hidden"
              }`}
            >
              Must match password.
            </p>
          </div>
        )}
  
        <button
          type="submit"
          className="btn btn-primary"
          disabled={
            isRegister
              ? !validUsername || !validEmail || !validPassword || !validMatch
              : false
          }
        >
          {isRegister ? "Sign Up" : "Sign In"}
        </button>
      </form>
  
      <p className="text-sm text-center">
        {isRegister ? "Already registered?" : "Not registered yet?"}
        <br />
        <NavLink
          to={isRegister ? "/home/signin" : "/home/register"}
          className="text-blue-600 underline"
          onClick={onNavigating}
        >
          {isRegister ? "Sign In" : "Sign Up"}
        </NavLink>
      </p>
    </div>
  );
}
