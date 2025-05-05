import React from 'react'
import { NavLink, useNavigate } from "react-router";
import { useContext } from "react";
import AuthContext from "../../Context/AuthProvider";

export default function Nav() {
  const { auth, setAuth } = useContext(AuthContext);

  const navigate = useNavigate();

  const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_ENDPOINT}/users/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
      });
      if (response.status !== 200) {
        throw new Error('Logout failed');
      }
      setAuth({});
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <NavLink to="/" className="btn btn-ghost normal-case text-xl">EchoWords</NavLink>
      </div>
      <div className="flex flex-1 gap-2">
        <div className='flex-1'>
        {/* <input
          type="text"
          placeholder="Search"
          className="input input-bordered w-24 md:w-auto"
        /> */}
        </div>
        {!auth.user && <div>
          <NavLink className='btn btn-ghost' to="/home/register">register</NavLink>
          <NavLink className='btn btn-ghost' to="/home/signin">sign in</NavLink>
        </div>}
        {auth.user && <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img
                alt="user avatar"
                src={auth.user.photo}
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-24 p-2 shadow"
          >
            <li>
              <NavLink to="/home/profile" className="text-base">
                Profile
              </NavLink>
            </li>
            <li>
              <button
                className='text-base'
                onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>}
      </div>
    </div>
  );
}
