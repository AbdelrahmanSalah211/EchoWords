import React from 'react';
import { useState, useEffect, useRef, useContext } from 'react';
import AuthContext from '../../Context/AuthProvider';
import Joi from "joi";

export default function Profile() {
  const usernameRef = useRef();
  useEffect(() => {
    usernameRef.current.focus();
  }, []);

  const [validUsername, setValidUsername] = useState(false);
  const [usernameFocus, setUsernameFocus] = useState(false);

  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [matchPassword, setMatchPassword] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);
  const [success, setSuccess] = useState(false);

  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [currentPasswordFocus, setCurrentPasswordFocus] = useState(false);

  const schema = Joi.object({
    username: Joi.string().min(4).required().label("Username"),

    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .label("Email"),

    password: Joi.string()
      .pattern(
        new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z0-9]).{8,}$")
      )
      .required()
      .label("Password")
      .messages({
        "string.pattern.base": `"Password" must contain at least 1 uppercase, 1 lowercase, 1 number, 1 special character and be at least 8 characters long.`,
      }),
  });

  const { auth, setAuth } = useContext(AuthContext);
  console.log(auth);

  const [user, setUser] = useState({
    username: auth.user.username,
    email: auth.user.email,
    photo: null,
  });

  const [password, setPassword] = useState("");

  const [errMsg, setErrMsg] = useState("");
  const errRef = useRef();

  useEffect(() => {
    const { value, error } = schema.extract("username").validate(user.username);
    console.log(user.username);
    console.log(value);
    setValidUsername(!error);
  }, [user.username]);

  useEffect(() => {
    const { value, error } = schema.extract("email").validate(user.email);
    console.log(user.email);
    console.log(value);
    setValidEmail(!error);
  }, [user.email]);

  useEffect(() => {
    const { value, error } = schema.extract("password").validate(password);
    console.log(password);
    console.log(value);
    setValidPassword(!error);
    const match = password === matchPassword;
    console.log(match);
    setValidMatch(match);
  }, [password, matchPassword]);

  useEffect(() => {
    setErrMsg("");
  }, [user.username, password, matchPassword, user.email]);

  const onPhotoChange = (e) => {
    setUser({ ...user, photo: e.target.files[0] });
  };

  const onUsernameChange = (e) => {
    setUser({ ...user, username: e.target.value });
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
    setUser({ ...user, email: e.target.value });
  };

  const onCurrentPasswordChange = (e) => {
    const newCurrentPassword = e.target.value;
    setCurrentPassword(newCurrentPassword);
  };

  const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;
  const API_KEY = import.meta.env.VITE_API_KEY;

  const handleEditProfile = async (e) => {
    e.preventDefault();
    try {
      let photoData;
      if(user.photo){
        const formData = new FormData();
        formData.append("key", API_KEY);
        formData.append("image", user.photo);
        const photoResponse = await fetch(`https://api.imgbb.com/1/upload?`, {
          method: "POST",
          body: formData
        })
        photoData = await photoResponse.json()
      }
      const profileData = {
        username: user.username,
        email: user.email
      }
      if(user.photo){
        profileData.photo = photoData.data.display_url
      }
      const response = await fetch(`${API_ENDPOINT}/users`, {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          "Authorization": `Bearer ${auth.token}`,
        },
        body: JSON.stringify(profileData),
      });
      const responseData = await response.json();
      console.log(responseData);
      if (response.status !== 200) {
        throw new Error(responseData.message);
      }
      setSuccess(true);
      const updatedUser = responseData.data.user;
      setAuth((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          username: updatedUser.username,
          email: updatedUser.email,
          photo: updatedUser.photo || prev.user.photo
        }
      }));
    } catch (error) {
      setErrMsg(error.message);
      console.error("Error updating profile:", error);
    }
  };

  const handleEditPassword = async (e) => {
    e.preventDefault();
    try {
      const passwordData = {
        currentPassword,
        newPassword: password,
      };
      const response = await fetch(`${API_ENDPOINT}/users/updatePassword`, {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
          "Authorization": `Bearer ${auth.token}`,
        },
        body: JSON.stringify(passwordData),
      });
      const data = await response.json();
      console.log(data);
      if (response.status !== 200) {
        throw new Error(data.message);
      }
      const { token } = data;
      setAuth((prev) => ({
        ...prev,
        token: token,
      }));
      setSuccess(true);
      setCurrentPassword("");
      setPassword("");
      setMatchPassword("");
      setValidPassword(false);
      setValidMatch(false);
      setCurrentPasswordFocus(false);
      setPasswordFocus(false);
      setMatchFocus(false);
      setErrMsg("");
    } catch (error) {
      setErrMsg(error.message);
      console.error("Error updating password:", error);
    }
  };

  const resetProfileInfo = () => {
    setUser({
      username: auth.user.username,
      email: auth.user.email,
      photo: auth.user.photo,
    });
  };

  return (
    <div className="px-6 md:px-20 xl:px-60 py-10">
      {/* title */}
      <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-800 drop-shadow-md">
        Profile
      </h1>

      {/* error msg */}
      {errMsg && (
        <p
          ref={errRef}
          className="alert alert-error text-sm font-semibold"
          aria-live="assertive"
        >
          {errMsg}
        </p>
      )}

      {/* edit profile form */}
      <form
        onSubmit={handleEditProfile}
        className="card bg-base-100 shadow-md px-30 py-8 mb-10 space-y-6"
      >
        {/* user photo */}
        <div className="flex flex-col items-center gap-4">
          <div className="avatar">
            <div className="w-54 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
              <img src={auth.user.photo} />
            </div>
          </div>
        </div>

        {/* username */}
        <div className="form-control">
          <label htmlFor="username" className="label">
            <span className="label-text">Username:</span>
          </label>
          <input
            type="text"
            id="username"
            ref={usernameRef}
            value={user.username}
            autoComplete="off"
            onChange={onUsernameChange}
            aria-invalid={!validUsername}
            aria-describedby="uidnote"
            onFocus={() => setUsernameFocus(true)}
            onBlur={() => setUsernameFocus(false)}
            className="input input-bordered w-full"
          />
          <p
            id="uidnote"
            className={`mt-1 text-xs p-2 rounded bg-neutral text-neutral-content ${
              usernameFocus && user.username && !validUsername ? "" : "hidden"
            }`}
          >
            4 to 24 characters. Must include upper and lower case letters.
          </p>
        </div>

        
        <div className="form-control">
          <label htmlFor="email" className="label">
            <span className="label-text">Email:</span>
          </label>
          <input
            type="email"
            id="email"
            value={user.email}
            autoComplete="off"
            onChange={onEmailChange}
            aria-invalid={!validEmail}
            aria-describedby="emailnote"
            onFocus={() => setEmailFocus(true)}
            onBlur={() => setEmailFocus(false)}
            required
            className="input input-bordered w-full"
          />
          <p
            id="emailnote"
            className={`mt-1 text-xs p-2 rounded bg-neutral text-neutral-content ${
              emailFocus && user.email && !validEmail ? "" : "hidden"
            }`}
          >
            Must be a valid email address.
          </p>
        </div>

        
        <input
          type="file"
          id="photo"
          accept="image/*"
          onChange={onPhotoChange}
          className="file-input file-input-bordered w-full max-w-xs"
        />

        <div className="flex justify-between">
          <button
            type="button"
            className="btn btn-soft"
            onClick={resetProfileInfo}
          >
            Reset
          </button>
          <button type="submit" className="btn btn-primary">
            Save Changes
          </button>
        </div>
      </form>

      <form
        onSubmit={handleEditPassword}
        className="card bg-base-100 shadow-md p-6 flex flex-col justify-center items-center gap-4"
      >
        <h2 className="text-2xl font-bold w-64">Change Password</h2>

        <div className="form-control flex flex-col gap-2 w-96">
          <label htmlFor="current-password" className="label">
            <span className="label-text">Current Password:</span>
          </label>
          <input
            type="password"
            id="current-password"
            className="input input-bordered"
            onChange={onCurrentPasswordChange}
            onFocus={() => setCurrentPasswordFocus(true)}
            onBlur={() => setCurrentPasswordFocus(false)}
            value={currentPassword}
          />
        </div>

        <div className="form-control flex flex-col gap-2 w-96">
          <label htmlFor="new-password" className="label">
            <span className="label-text">New Password:</span>
          </label>
          <input
            type="password"
            id="new-password"
            value={password}
            aria-invalid={!validPassword}
            aria-describedby="pwdnote"
            onChange={onPasswordChange}
            onFocus={() => setPasswordFocus(true)}
            onBlur={() => setPasswordFocus(false)}
            required
            className="input input-bordered"
          />
          <p
            id="pwdnote"
            className={`mt-1 text-xs p-2 rounded bg-neutral text-neutral-content ${
              passwordFocus && !validPassword ? "" : "hidden"
            }`}
          >
            Must include upper and lower case letters.
            <br />
            Allowed special characters: <code>!@#$%</code>
          </p>
        </div>

        <div className="form-control flex flex-col gap-2 w-96">
          <label htmlFor="match-new-password" className="label">
            <span className="label-text">Confirm Password:</span>
          </label>
          <input
            type="password"
            id="match-new-password"
            value={matchPassword}
            aria-invalid={!validMatch}
            aria-describedby="matchnote"
            onChange={onMatchPasswordChange}
            onFocus={() => setMatchFocus(true)}
            onBlur={() => setMatchFocus(false)}
            required
            className="input input-bordered"
          />
          <p
            id="matchnote"
            className={`mt-1 text-xs p-2 rounded bg-neutral text-neutral-content ${
              !validMatch ? "" : "hidden"
            }`}
          >
            Must match the new password.
          </p>
        </div>

        <div className="flex w-48">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={
              !validPassword && !validMatch // disable button if fields are empty
            }
          >
            Update Password
          </button>
        </div>
      </form>
    </div>
  );
}