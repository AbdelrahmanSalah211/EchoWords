import React from 'react'
import AuthContext from "../../Context/AuthProvider";
import { useContext } from "react";


export default function Post({
  title,
  body,
  image,
  userId,
  editModalRef
}) {
  const { auth } = useContext(AuthContext);

  const loggedUserId = auth.user ? auth.user.id : null;

  return (
    <div className="card bg-base-100 w-96 shadow-sm">
      <div className="card-body">
        <div className="flex justify-between items-center">
          <h2 className="card-title">{title}</h2>
          {(loggedUserId === userId) && <details className="dropdown">
            <summary className="btn m-1">:</summary>
            <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
              <li>
                <button className="justify-between" onClick={() => editModalRef.current.showModal()}>
                  Edit
                </button>
              </li>
            </ul>
          </details>}
        </div>
        <p>{body}</p>
      </div>
      {image && (
        <figure>
          <img src={image} alt="image" />
        </figure>
      )}
    </div>
  );
}
