import React from 'react'
import { useNavigate } from "react-router";
import { useContext } from "react";
import AuthContext from "../../Context/AuthProvider";

export default function Nav() {
  const { auth, setAuth } = useContext(AuthContext);
  console.log(auth);
  
  const navigate = useNavigate();
  
    // if(!auth.user){
    //   navigate("/signin", { replace: true });
    // }


  const handleLogout = () => {
    setAuth({});
    navigate("/home/signin", { replace: true });
  }

  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">EchoWords</a>
      </div>
      <div className="flex flex-1 gap-2">
        <div className='flex-1'>
        <input
          type="text"
          placeholder="Search"
          className="input input-bordered w-24 md:w-auto"
        />

        </div>
        {!auth.user && <div>
          <a className='btn btn-ghost' href="/home/register">register</a>
          <a className='btn btn-ghost' href="/home/signin">sign in</a>
        </div>}
        {auth.user && <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <img
                alt="Tailwind CSS Navbar component"
                src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <a className="justify-between">
                Profile
              </a>
            </li>
            <li>
              <button onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>}
      </div>
    </div>
  );
}
